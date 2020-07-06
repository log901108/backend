var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

module.exports = (req, res, next) => {
  //const { id } = req.params;
  const objectId = req.originalUrl;
  client.get(objectId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({ success: false, err: err });
    } else {
      if (data != null) {
        //!data exsits
        req.client = client; //set redis client
        console.log('cached');
        var value = JSON.parse(data);
        res.json(value);
      } else {
        //! no data
        req.client = client;
        next();
      }
    }
  });
};
