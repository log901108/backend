var express = require('express');
var router = express.Router();

const chargesCtrls = require('./charges.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', chargesCtrls.postCreate);
router.get('/:id', mcheckchache, chargesCtrls.getRead);
router.delete('/:id', chargesCtrls.deleteDelete);
router.post('/profile', chargesCtrls.postProfile);
router.get('/profile/:name', chargesCtrls.getProfile);

module.exports = router;
