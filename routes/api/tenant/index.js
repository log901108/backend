var express = require('express');
var router = express.Router();

const tenantsCtrls = require('./tenants.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', tenantsCtrls.postCreate);
router.get('/:id', mcheckchache, tenantsCtrls.getRead);
router.delete('/:id', tenantsCtrls.deleteDelete);
router.post('/profile', tenantsCtrls.postProfile);
router.get('/profile/:name', tenantsCtrls.getProfile);

module.exports = router;
