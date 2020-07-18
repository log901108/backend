var express = require('express');
var router = express.Router();

const ledgersCtrls = require('./ledgers.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', ledgersCtrls.postCreate);
router.get('/:id', mcheckchache, ledgersCtrls.getRead);
router.delete('/:id', ledgersCtrls.deleteDelete);
router.post('/profile', ledgersCtrls.postProfile);
router.get('/profile/:name', ledgersCtrls.getProfile);

module.exports = router;
