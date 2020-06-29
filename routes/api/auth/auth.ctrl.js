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

exports.getList = async (req, res) => {
  users_tbl
    .findAndCountAll({ order: [['id', 'ASC']] })
    .then((result) => {
      res
        .status(200)
        .send({ success: true, datacount: result.count, data: result.rows });
    })
    .catch((err) => res.status(400).send({ success: false, err: err }));
};

exports.getInfo = async (req, res) => {
  users_tbl
    .findOne({
      where: {
        id: req.params.id,
      },
      limit: 1,
    })
    .then((result) => {
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
//::TODO:: SHOULD FIX UNIQUE CONSTRAINT ERROR
module.exports.postSignup = function (req, res) {
  if (!req.body.userid || !req.body.username || !req.body.password) {
    res.status(400).send({ msg: 'Please pass username and password.' });
  } else {
    if (
      !validator.isAlphanumeric(req.body.password) &&
      validator.isLength(req.body.password, { min: 5, max: 15 })
    ) {
      users_tbl
        .create({
          userid: req.body.userid,
          username: req.body.username,
          password_hash: req.body.password,
        })
        .then(async (user) => {
          //Since user gets login session with signup, update signin_trial_tbl
          signin_trial_tbl.create({
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
                id: user.id,
                userid: user.userid,
                refresh: RefreshToken,
              })
            ),
            process.env.JWTSECRET,
            { expiresIn: 30 * 60 }
          );

          res.cookie('token', AccessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 60 * 1000),
          });

          res.status(201).send(user);
        })
        .catch((err) => {
          console.log(err);
          if (err.parent.code == 23505) {
            //unique constraint error
            res.status(409).send({ msg: 'already exists id' });
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
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:', RefreshToken);
            //4.Issue Access Token
            var AccessToken = await jwt.sign(
              JSON.parse(
                JSON.stringify({
                  id: user.id,
                  userid: user.userid,
                  refresh: RefreshToken,
                })
              ),
              process.env.JWTSECRET,
              { expiresIn: 30 * 60 }
            );

            //5.Store at Browser Cookie
            res.cookie('token', AccessToken, {
              httpOnly: true,
              expires: new Date(Date.now() + 30 * 60 * 1000),
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
