const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;
const users_tbl = require('../models').users_tbl;

//! https://christiangiacomi.com/posts/express-barer-strategy/
module.exports = function (passport) {
  passport.use(
    new BearerStrategy(function (token, done) {
      try {
        if (jwt.verify(token, process.env.JWTSECRET)) {
          var decoded = jwt.decode(token, process.env.JWTSECRET);
          users_tbl.findOne({ where: { uuid: decoded.uuid } }).then((user) => {
            if (!user) {
              return done(null, false, { msg: 'Incorrect USER' });
            } else {
              return done(null, user);
            }
          });
        } else {
          return done(null, false, { msg: 'invalid token' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );
};
