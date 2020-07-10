//middleware for check login status and set req.user by decoded jwt
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  if (!token) {
    return next();
  } else {
    try {
      var access = await jwt.sign(token, process.env.JWTSECRET, function (
        err,
        data
      ) {
        //TODO access token은 json으로 넘기고 refresh token은 cookie에 박도록 바꾸기
        //TODO https://velog.io/@yaytomato/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%90%EC%84%9C-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0
        req.accesstoken = data;
        console.log(req.accesstoken);
      });
      return next();
    } catch (e) {
      return next();
    }
  }
};
