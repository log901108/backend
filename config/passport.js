const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const BearerStrategy = require('passport-http-bearer').Strategy;
// load up the user model
const users_tbl = require('../models').users_tbl;

/*
module.exports = function(passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: 'nodeauthsecret',
  };
  passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    User
      .findByPk(jwt_payload.id)
      .then((user) => { return done(null, user); })
      .catch((error) => { return done(error, false); });
  }));
};
*/

//* 7.9 쿠키용 스트레터지
var cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) token = req.cookies['token'];
  return token;
};
//TODO https://christiangiacomi.com/posts/express-barer-strategy/
module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = cookieExtractor; // check token in cookie
  opts.secretOrKey = process.env.JWTSECRET;
  /*passport.use(
    'jwt',
    new JwtStrategy(opts, function (jwt_payload, done) {
     
    //User
    //  .findByPk(jwt_payload.id)
    //  .then((user) => { return done(null, user); })
    //  .catch((error) => { return done(error, false); });
	  
      //refresh token 적용
      console.log('payload:', jwt_payload);
      users_tbl
        .findOne({
          where: {
            refresh_token: jwt_payload.refresh,
            id: jwt_payload.id,
          },
          limit: 1,
        })
        .then((user) => {
          if (user) {
            return done(null, user); //유효한 토큰일 경우
          } else {
            return done(null, false); //못찾을경우(동시로그인 등으로 token값은 있으나 유효한 토큰이 아닐때)
          }
        })
        .catch((error) => {
          return done(error, false);
        });
    })
  );
*/
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
//7.9 쿠키용 스트레터지
