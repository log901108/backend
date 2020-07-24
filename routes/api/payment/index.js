var express = require('express');
var router = express.Router();

const paymentsCtrls = require('./payments.ctrl');

const mcheckcache = require('../auth/middle/mcheckcache');

const wrapper = (asyncFn) => {
  return async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};

router.post('/', wrapper(paymentsCtrls.postCreate));
router.get('/:id', mcheckcache, wrapper(paymentsCtrls.getRead));
router.get('/', mcheckcache, wrapper(paymentsCtrls.getList));
router.delete('/:id', wrapper(paymentsCtrls.deleteDelete));
router.post('/profile', paymentsCtrls.postProfile);
router.get('/profile/:name', paymentsCtrls.getProfile);

module.exports = router;
