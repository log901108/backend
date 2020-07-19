var express = require('express');
var router = express.Router();

const paymentsCtrls = require('./payments.ctrl');

const mcheckcache = require('../auth/middle/mcheckcache');

router.post('/', paymentsCtrls.postCreate);
router.get('/:id', mcheckcache, paymentsCtrls.getRead);
router.get('/', mcheckcache, paymentsCtrls.getList);
router.delete('/:id', paymentsCtrls.deleteDelete);
router.post('/profile', paymentsCtrls.postProfile);
router.get('/profile/:name', paymentsCtrls.getProfile);

module.exports = router;
