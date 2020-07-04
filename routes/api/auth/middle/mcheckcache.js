var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

module.exports = (req, res, next) => {
  //const { id } = req.params;
  const objectid = req.originalUrl;
  client.get(objectid, (err, data) => {
    if (err) {
      console.log(err);
      res.staus(500).send({ success: false, err: err });
    }
    if (data != null) {
      //data exsits
      req.client = client; //set redis client
      console.log(objectid);
      console.log('cached');
      res.send(data);
    } else {
      req.client = client;
      next();
    }
  });
};
