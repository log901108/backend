var express = require('express');
var router = express.Router();

const chargepaymentsCtrls = require('./charge_payment.ctrl');

const wrapper = require('../../../util/asyncwrapper');
const mcheckcache = require('../auth/middle/mcheckcache');

router.post('/', wrapper(chargepaymentsCtrls.postCreate));
router.get('/:id', mcheckcache, wrapper(chargepaymentsCtrls.getRead));
router.get('/', mcheckcache, wrapper(chargepaymentsCtrls.getList));
router.delete('/:id', wrapper(chargepaymentsCtrls.deleteDelete));
router.post('/profile', chargepaymentsCtrls.postProfile);
router.get('/profile/:name', chargepaymentsCtrls.getProfile);

module.exports = router;
