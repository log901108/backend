const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../../../config/passport')(passport);
const models = require('../../../models');
const users_tbl = require('../../../models').users_tbl;
const signin_trial_tbl = require('../../../models').signin_trial_tbl;

const requestIp = require('request-ip');
const validator = require('validator');

module.exports.getList = async (req, res) => {
  users_tbl
    .findAndCountAll({ order: [['id', 'ASC']] })
    .then((result) => {
      res
        .status(200)
        .send({ success: true, datacount: result.count, data: result.rows });
    })
    .catch((err) => res.status(400).send({ success: false, err: err }));
};

module.exports.getInfo = async (req, res) => {
  var objectId = req.originalUrl;
  console.log('header:', req.headers);
  users_tbl
    .findOne({
      where: {
        uuid: req.params.uuid,
      },
      limit: 1,
    })
    .then((result) => {
      req.client.setex(
        objectId,
        100,
        JSON.stringify({ success: true, data: result })
      );
      res.status(200).send({ success: true, data: result });
    })
    .catch((err) => res.status(400).send({ success: false, err: err }));
};

passwordValidator = (password) => {
  if (
    !validator.isAlphanumeric(password) &&
    validator.isLength(password, { min: 5, max: 15 })
  ) {
    return true;
  } else {
    return false;
  }
};

//post router function for signup
module.exports.postSignup = function (req, res) {
  if (!req.body.userid || !req.body.username || !req.body.password) {
    res.status(400).send({ msg: 'Please pass username and password.' });
  } else {
    if (passwordValidator(req.body.password)) {
      users_tbl
        .create({
          userid: req.body.userid,
          username: req.body.username,
          password_hash: req.body.password,
        })
        .then(async (user) => {
          //Since user gets login session with signup, update signin_trial_tbl
          await signin_trial_tbl.create({
            requested_userid: req.body.userid,
            requested_password: req.body.password,
            trial_time: Date.now(),
            trial_ip: requestIp.getClientIp(req),
          });

          //Since user gets login session with signup, update users_tbl
          const RefreshToken = await user.UpdateRefreshtoken(
            user.userid,
            86400 * 14
          ); //14days
          user.UpdateClearLoginFailCount(user.userid);
          user.UpdateLoginIp(req, req.body.userid);
          user.UpdateloginTrialDate(req.body.userid);
          user.UpdateLoginDate(req.body.userid);

          var AccessToken = await jwt.sign(
            JSON.parse(
              JSON.stringify({
                uuid: user.uuid,
                userid: user.userid,
                refresh: RefreshToken,
              })
            ),
            process.env.JWTSECRET,
            { expiresIn: process.env.JWTACCESSTOKENMINUTE * 60 }
          );

          res.cookie('token', AccessToken, {
            httpOnly: true,
            expires: new Date(
              Date.now() + process.env.JWTACCESSTOKENMINUTE * 60 * 1000
            ),
          });

          //! set Refresh token at cookie & accesstoken at user
          //! accesstoken을 json으로 넘기고 BARER AUTHORIZATION으로 넘겨서 Authenticate
          res.cookie('token', RefreshToken, {
            httpOnly: true,
            expires: new Date(
              Date.now() + process.env.JWTACCESSTOKENMINUTE * 60 * 1000
            ),
          });

          res
            .status(201)
            .send({ success: true, user: user, token: AccessToken });
        })
        .catch((err) => {
          console.log(err);
          if (err.parent.code == 23505) {
            //unique constraint error
            res.status(409).send({ msg: 'already exists id', error: err });
          } else {
            res.status(400).send({ msg: 'commit db error' });
          }
        });
    } else {
      //validator
      res.status(400).send({ msg: 'please pass valid username and password.' });
    }
  }
};

//post router function for login
module.exports.postLogin = function (req, res, next) {
  signin_trial_tbl.create({
    requested_userid: req.body.userid,
    requested_password: req.body.password,
    trial_time: Date.now(),
    trial_ip: requestIp.getClientIp(req),
  });

  users_tbl
    .findOne({
      where: {
        userid: req.body.userid,
      },
      limit: 1,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          msg: 'Authentication failed. User not founded.',
        });
      }

      //**The session for issuing token after matching passwd_hash and trial passwd
      //1. check passwd_hash and trial by users_tbl's instance method of 'comparePassword'
      user.comparePassword(req.body.password, async (err, isMatch) => {
        //2.execute under when passwd_hash matched
        if (isMatch && !err) {
          if (user.is_account_lock) {
            res.status(409).send({
              success: false,
              msg:
                'Authentication failed. Account locked because of invalid id or passwd trial more than 5',
            });
          } else {
            //normal case
            //3. update users_tbl's login info
            const RefreshToken = await user.UpdateRefreshtoken(
              req.body.userid,
              86400 * 14
            );
            user.UpdateClearLoginFailCount(req);
            user.UpdateLoginIp(req, req.body.userid);
            user.UpdateloginTrialDate(req.body.userid);
            user.UpdateLoginDate(req.body.userid);

            //4.Issue Access Token
            var AccessToken = await jwt.sign(
              JSON.parse(
                JSON.stringify({
                  uuid: user.uuid,
                  userid: user.userid,
                  refresh: RefreshToken,
                })
              ),
              process.env.JWTSECRET,
              { expiresIn: process.env.JWTACCESSTOKENMINUTE * 60 }
            );

            //5.Store at Browser Cookie
            res.cookie('token', AccessToken, {
              httpOnly: true,
              expires: new Date(
                Date.now() + process.env.JWTACCESSTOKENMINUTE * 60 * 1000
              ),
            });

            //6.Response with json
            res.status(200).send({
              success: true,
              token: 'JWT ' + AccessToken,
              userid: user.userid,
              createdAt: user.createdAt,
            }); //should give required info
          }
        } else {
          //isMatch == dismatched passwd
          user.PlusLoginFailCount(req);
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password',
          });
        }
      });
    })
    .catch((err) => res.status(400).send(err));
};

//post router for logout
module.exports.postLogout = function (req, res) {
  var token = getToken(req);
  if (token) {
    res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) });
    res.status(201).send({});
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized' });
  }
};

getToken = function (req) {
  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  return token;
};

module.exports.getCheck2 = async function (req, res) {
  var access = await getToken(req);
  if (!access) {
    res.status(401).send({ success: false, msg: 'Unauthorized' });
  } else {
    var decode = await jwt.verify(access, process.env.JWTSECRET, function (
      err,
      data
    ) {
      console.log('decode:', data);
      console.log(data.uuid);
      console.log(data.userid);
      var user = { uuid: data.uuid, userid: data.userid };
      res.status(200).send(user);
    });
  }
};

module.exports.getCheck = async function (req, res) {
  var user = null;
  if (req.user) {
    user = req.user;
  }

  if (!user) {
    res.status(401).send({ success: false, msg: 'Unauthorized' });
  } else {
    res.status(200).send(user);
  }
};

//signup with transaction
module.exports.transaction = function (req, res) {
  return models.sequelize
    .transaction((t) => {
      console.log(req.body);
      if (!req.body.userid || !req.body.username || !req.body.password) {
        res
          .status(400)
          .send({ success: false, msg: 'please pass username and passwd' });
      } else {
        if (passwordValidator(req.body.password)) {
          //chain all your queries here. make sure you return them.
          return users_tbl.create(
            {
              userid: req.body.userid,
              password_hash: req.body.password,
              username: req.body.username,
            },
            { transaction: t }
          );
        }
      }
    })
    .then(async (user) => {
      //transaction has been committed
      //result is whatever the result of the promise chain returned to the transaction callback
      //update sign_trial_tbl, since execute login with signup at the sametime
      signin_trial_tbl.create({
        requested_userid: req.body.userid,
        requested_password: req.body.password,
        trial_time: Date.now(),
        trial_ip: requestIp.getClientIp(req),
      });

      //update users_tbl for simultaneous sigunp and signin
      const RefreshToken = await user.UpdateRefreshtoken(
        user.userid,
        86400 * 14
      );
      user.UpdateClearLoginFailCount(user.userid);
      user.UpdateLoginIp(req, req.body.userid);
      user.UpdateloginTrialDate(req.body.userid);
      user.UpdateLoginDate(req.body.userid);

      var AccessToken = await jwt.sign(
        JSON.parse(
          JSON.stringify({
            uuid: user.uuid,
            userid: user.userid,
            refresh: RefreshToken,
          })
        ),
        process.env.JWTSECRET,
        { expiresIn: process.env.JWTACCESSTOKENMINUTE * 60 }
      );
      res.cookie('token', AccessToken, {
        httpOnly: true,
        expires: new Date(
          Date.now() + process.env.JWTACCESSTOKENMINUTE * 60 * 1000
        ),
      });
      res.status(201).send(user);
    })
    .catch((err) => {
      //Transaction has been rolled back
      //err is whatever rejected the promise chain returned to the transaction callback
      console.log(err);
      if (err.parent.code == 23505) {
        //UNIQUE constraint error
        res.status(409).send({ msg: 'id alread exist' });
      } else {
        res.status(400).send({ msg: 'comit db error' });
      }
    });
};

//delete data with delete method
module.exports.deleteDelete = async (req, res) => {
  const user_id = req.params.uuid;
  return models.sequelize
    .transaction((t) => {
      return users_tbl.destroy({ where: { uuid: user_id }, transaction: t });
    })
    .then((result) => {
      if (result == 0) {
        res.status(404).send({ success: false, msg: 'No user found' });
      } else {
        req.client.del(`/api/auth/info/${user_id}`); //! delete cache
        //req.client.quit();
        res.status(200).send({
          success: true,
          deleted: user_id,
          msg: `#${user_id} user is deleted`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({ success: false, msg: err });
    });
};

//update data with patch method
module.exports.patchUpdate = async (req, res) => {
  const user_id = req.params.uuid;
  var updatePhrase = {};

  if (req.body.username) {
    updatePhrase['username'] = req.body.username;
  }

  if (req.body.password) {
    if (!passwordValidator(req.body.password)) {
      return res.status(409).send({
        success: false,
        msg: 'new password does not match with validation rule',
      });
    } else {
      updatePhrase['password_hash'] = req.body.password;
    }
  }

  return models.sequelize
    .transaction((t) => {
      return users_tbl.findOne({ where: { uuid: user_id } }).then((user) => {
        console.log('user:', user.uuid);
        req.client.del(`/api/auth/info/${user_id}`); //! delete cache
        //req.client.quit();
        user.update(updatePhrase, {
          returning: true,
          plain: true,
        });
      });
    })
    .then((result) => {
      if (!req.body.username && !req.body.password) {
        res.status(204).send({ success: true, changed: false });
      } else {
        console.log('res:', result);
        //req.client.setex(objectId, 100, JSON.stringify(result));
        res.status(200).send({ success: true, changed: true });
      }
    })
    .catch((err) => {
      res.status(400).send({ success: false, msg: err });
    });
};
