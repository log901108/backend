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
        //! signinDate 변수 관리 어떻게할지? => signinDate는 유지 iat와 exp만 변경
        //! req.user = {uuid, userid, username, signinDate, iat, exp}
        req.user = data;
      });
      return next();
    } catch (e) {
      return next();
    }
  }
};
