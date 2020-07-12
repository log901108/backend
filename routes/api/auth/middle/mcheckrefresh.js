//middleware for checking refresh token from DB
const jwt = require('jsonwebtoken');
const users_tbl = require('../../../../models').users_tbl;

module.exports = async function (req, res, next) {
  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  if (!token) {
    return res.status(404).send({ success: false, msg: 'no refresh token' });
  } else {
    try {
      users_tbl.findOne({ where: { refresh_token: token } }).then((result) => {
        if (!result) {
          return res
            .status(404)
            .send({ success: false, msg: 'INVALID refresh token' });
        }
        req.refresh = result;
        return next();
      });
    } catch (e) {
      return next();
    }
  }
};
