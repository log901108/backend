var express = require('express');
var router = express.Router();

const chargesCtrls = require('./charges.ctrl');
const chargeitemsCtrls = require('./chargeitems.ctrl');

const wrapper = require('../../../util/asyncwrapper');
const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/item', wrapper(chargeitemsCtrls.postCreate));
router.get('/item/:id', mcheckchache, wrapper(chargeitemsCtrls.getRead));
router.delete('/item/:id', wrapper(chargeitemsCtrls.deleteDelete));

router.post('/journal', wrapper(chargesCtrls.postCreate));
router.get('/journal/', mcheckchache, wrapper(chargesCtrls.getList));
router.get('/journal/:id', mcheckchache, wrapper(chargesCtrls.getRead));
router.delete('/journal/:id', wrapper(chargesCtrls.deleteDelete));

router.post('/profile', chargesCtrls.postProfile);
router.get('/profile/:name', chargesCtrls.getProfile);

module.exports = router;
