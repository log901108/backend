//middleware for check login status and set req.user by decoded jwt
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  if (!token) {
    return next();
  } else {
    try {
      var decode = await jwt.verify(token, process.env.JWTSECRET, function (
        err,
        data
      ) {
        //TODO signinDate 변수 관리 어떻게할지?
        /* {uuid, userid, signinDate, iat, exp} */
        req.user = data;

        console.log(req.user);
      });
      return next();
    } catch (e) {
      return next();
    }
  }
};
