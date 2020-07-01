//redis ex

var redis = require('redis');

var client = redis.createClient(6379, '127.0.0.1');

//redis ex

module.exports = (req, res, next) => {
  const { id } = req.params;

  client.get(id, (err, data) => {
    if (err) {
      console.log(err);
      res.staus(500).send({ success: false, err: err });
    }
    if (data != null) {
      req.client = client;
      console.log('cached');
      res.send(data);
    } else {
      req.client = client;
      next();
    }
  });
};
