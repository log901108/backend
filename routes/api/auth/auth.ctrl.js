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

//* @get router function for getting list of users
exports.getList = async (req, res) => {
  return users_tbl
    .findAndCountAll({ order: [['id', 'ASC']] })
    .then((result) => {
      return res
        .status(200)
        .send({ success: true, datacount: result.count, data: result.rows });
    })
    .catch((err) => res.status(400).send({ success: false, err: err }));
};

//* @get router function for getting information of each user
exports.getInfo = async (req, res) => {
  var objectId = req.originalUrl;
  console.log('header:', req.headers);
  return users_tbl
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
      return res.status(200).send({ success: true, data: result });
    })
    .catch((err) => res.status(400).send({ success: false, err: err }));
};

//! password validator
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

//@post router function for signup
exports.postSignup = async function (req, res) {
  if (!req.body.userid || !req.body.username || !req.body.password) {
    return res.status(400).send({ msg: 'Please pass username and password.' });
  } else {
    if (passwordValidator(req.body.password)) {
      await users_tbl
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
            user.uuid,
            user.userid,
            86400 * process.env.REFRESHTOKENDAY
          ); //! 14days
          await user.UpdateClearLoginFailCount(user.userid);
          await user.UpdateLoginIp(req, req.body.userid);
          await user.UpdateloginTrialDate(req.body.userid);
          await user.UpdateLoginDate(req.body.userid);

          var AccessToken = await jwt.sign(
            JSON.parse(
              JSON.stringify({
                uuid: user.uuid,
                userid: user.userid,
                signinDate: Date.now(),
                //refresh: RefreshToken,
              })
            ),
            process.env.JWTSECRET,
            { expiresIn: process.env.JWTACCESSTOKENMINUTE * 60 }
          );

          //res.cookie('token', RefreshToken, {
          //  httpOnly: true,
          //  expires: new Date(
          //    Date.now() + process.env.JWTACCESSTOKENMINUTE * 60 * 1000
          //  ),
          //});

          //! set Refresh token at cookie & accesstoken at user
          //! accesstoken을 json으로 넘기고 BARER AUTHORIZATION으로 넘겨서 Authenticate
          res.cookie('token', RefreshToken, {
            httpOnly: true,
            expires: new Date(
              Date.now() + process.env.JWTACCESSTOKENMINUTE * 60 * 1000
            ),
          });

          return res
            .status(201)
            .send({ success: true, user: user, token: AccessToken });
        })
        .catch((err) => {
          if (err.parent.code == 23505) {
            //unique constraint error
            return res
              .status(409)
              .send({ message: 'already exists id', error: err });
          } else {
            return res.status(400).send({ message: 'commit db error' });
          }
        });
    } else {
      //! validator error
      res.status(400).send({ msg: 'please pass valid username and password.' });
    }
  }
};

//* @post router function for login
exports.postLogin = async function (req, res, next) {
  await signin_trial_tbl.create({
    requested_userid: req.body.userid,
    requested_password: req.body.password,
    trial_time: Date.now(),
    trial_ip: requestIp.getClientIp(req),
  });

  return users_tbl
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
              user.uuid,
              req.body.userid,
              86400 * process.env.REFRESHTOKENDAY //! 14days
            );
            await user.UpdateClearLoginFailCount(req);
            await user.UpdateLoginIp(req, req.body.userid);
            await user.UpdateloginTrialDate(req.body.userid);
            await user.UpdateLoginDate(req.body.userid);

            //4.Issue Access Token
            var AccessToken = await jwt.sign(
              JSON.parse(
                JSON.stringify({
                  uuid: user.uuid,
                  userid: user.userid,
                  signinDate: Date.now(),
                  //refresh: RefreshToken,
                })
              ),
              process.env.JWTSECRET,
              { expiresIn: process.env.JWTACCESSTOKENMINUTE * 60 }
            );

            //5.Store at Browser Cookie
            res.cookie('token', RefreshToken, {
              httpOnly: true,
              expires: new Date(
                Date.now() + process.env.REFRESHTOKENDAY * 24 * 60 * 60 * 1000 //! 14days
              ),
            });

            //6.Response with json
            return res.status(200).send({
              success: true,
              token: AccessToken,
              userid: user.userid,
              createdAt: user.createdAt,
            }); //should give required info
          }
        } else {
          //isMatch == dismatched passwd
          await user.PlusLoginFailCount(req);
          return res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password',
          });
        }
      });
    })
    .catch((err) => res.status(400).send({ success: false, error: err }));
};

//* @post router function for logout
exports.postLogout = function (req, res) {
  var token = getToken(req);
  if (token) {
    res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) });
    return res.status(201).send({});
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized' });
  }
};

getToken = function (req) {
  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  return token;
};

exports.getCheck2 = async function (req, res) {
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

exports.getCheck = async function (req, res) {
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

//* @post router for issuing Access Token by Refresh Token at cookie
exports.postCreatetoken = async function (req, res, next) {
  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  if (!token) {
    return next();
  } else {
    try {
      var current_time = (new Date() / 1000) | 0; //same as with code : Math.floor(new Date() / 1000)
      var access = await jwt.sign(
        {
          uuid: req.user.uuid,
          userid: req.user.userid,
          signinDate: req.user.signinDate,
          iat: current_time,
          exp: current_time + process.env.JWTACCESSTOKENMINUTE * 60,
        },
        process.env.JWTSECRET,
        (err, data) => {
          if (err) {
            return res.status(400).send({ success: false, error: err });
          }
          req.accesstoken = data;
        }
      );
      return res.status(200).send({ success: true, data: req.accesstoken });
    } catch (e) {
      return res.status(400).send({ success: false, error: err });
    }
  }
};

//* @post router signup with transaction
exports.transaction = function (req, res) {
  return models.sequelize
    .transaction((t) => {
      console.log(req.body);
      if (!req.body.userid || !req.body.username || !req.body.password) {
        res.status(400).send({
          success: false,
          msg: 'please pass valid username and password',
        });
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
      await signin_trial_tbl.create({
        requested_userid: req.body.userid,
        requested_password: req.body.password,
        trial_time: Date.now(),
        trial_ip: requestIp.getClientIp(req),
      });

      //update users_tbl for simultaneous sigunp and signin
      const RefreshToken = await user.UpdateRefreshtoken(
        user.uuid,
        user.userid,
        86400 * process.env.REFRESHTOKENDAY
      );
      await user.UpdateClearLoginFailCount(user.userid);
      await user.UpdateLoginIp(req, req.body.userid);
      await user.UpdateloginTrialDate(req.body.userid);
      await user.UpdateLoginDate(req.body.userid);

      var AccessToken = await jwt.sign(
        JSON.parse(
          JSON.stringify({
            uuid: user.uuid,
            userid: user.userid,
            signinDate: Date.now(),
            //refresh: RefreshToken,
          })
        ),
        process.env.JWTSECRET,
        { expiresIn: process.env.JWTACCESSTOKENMINUTE * 60 }
      );

      res.cookie('token', RefreshToken, {
        httpOnly: true,
        expires: new Date(
          Date.now() + process.env.REFRESHTOKENDAY * 12 * 60 * 60 * 1000
        ),
      });
      res.status(201).send({ user: user, token: AccessToken });
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

//* @delete router for delete data with delete method
exports.deleteDelete = async (req, res) => {
  const user_id = req.params.uuid;
  return models.sequelize
    .transaction((t) => {
      return users_tbl.destroy({ where: { uuid: user_id }, transaction: t });
    })
    .then((result) => {
      if (result == 0) {
        res.status(404).send({
          success: false,
          token: req.accesstoken,
          refresh: req.refresh,
          msg: 'No user found',
        });
      } else {
        req.client.del(`/api/auth/info/${user_id}`); //! delete cache
        //req.client.quit();
        res.status(200).send({
          success: true,
          deleted: user_id,
          token: req.accesstoken,
          refresh: req.refresh,
          msg: `#${user_id} user is deleted`,
        });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ success: false, token: req.accesstoken, msg: err });
    });
};

//* @patch router for update data with patch method
exports.patchUpdate = async (req, res) => {
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
        res.status(201).send({ success: true, changed: true });
      }
    })
    .catch((err) => {
      res.status(400).send({ success: false, msg: err });
    });
};
