var express = require('express');
var router = express.Router();

const chargesCtrls = require('./charges.ctrl');
const chargeitemsCtrls = require('./chargeitems.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/item', chargeitemsCtrls.postCreate);
router.get('/item/:id', mcheckchache, chargeitemsCtrls.getRead);
router.delete('/item/:id', chargeitemsCtrls.deleteDelete);

router.post('/journal', chargesCtrls.postCreate);
router.get('/journal/', mcheckchache, chargesCtrls.getList);
router.get('/journal/:id', mcheckchache, chargesCtrls.getRead);
router.delete('/journal/:id', chargesCtrls.deleteDelete);

router.post('/profile', chargesCtrls.postProfile);
router.get('/profile/:name', chargesCtrls.getProfile);

module.exports = router;
