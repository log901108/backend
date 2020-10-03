var express = require('express');
var router = express.Router();
const authCtrl = require('./auth.ctrl');
const passport = require('passport');
require('../../../config/passport')(passport);

const wrapper = require('../../../util/asyncwrapper');

const mcheckcache = require('./middle/mcheckcache');
const mcheckrefresh = require('./middle/mcheckrefresh');

router.get('/', authCtrl.getList);
router.get('/info/:uuid', mcheckcache, authCtrl.getInfo);
router.get('/check', authCtrl.getCheck);
router.get('/check2', authCtrl.getCheck2);

/* POST users listing. */
router.post('/transaction', authCtrl.transaction);
router.post('/signup', authCtrl.postSignup);

router.post('/login', wrapper(authCtrl.postLogin));

router.post(
  '/logout',
  passport.authenticate('bearer', { session: false, failWithError: true }),
  authCtrl.postLogout
);

//! API for Issue Access Token by refresh token at cookie
router.post('/token', mcheckrefresh, authCtrl.postCreatetoken);

router.post('/post', authCtrl.transaction);

router.delete(
  '/delete/:uuid',
  mcheckcache,
  mcheckrefresh,
  passport.authenticate('bearer', { session: false, failWithError: true }),
  authCtrl.deleteDelete
);

router.patch(
  '/update/:uuid',
  mcheckcache,
  //passport.authenticate('bearer', { session: false, failWithError: true }),
  authCtrl.patchUpdate
);

//! Middleware error handler for json response
//! https://stackoverflow.com/questions/15388206/sending-back-a-json-response-when-failing-passport-js-authentication
function handleError(err, req, res, next) {
  var output = {
    error: {
      name: err.name,
      message: err.message,
      text: err.toString(),
    },
  };
  var statusCode = err.status || 500;
  res.status(statusCode).json(output);
}

router.use([handleError]);

module.exports = router;
