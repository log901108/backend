var express = require('express');
var router = express.Router();

const vouchersCtrls = require('./vouchers.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', vouchersCtrls.postCreate);
router.get('/', vouchersCtrls.getList);
router.get('/:id', mcheckchache, vouchersCtrls.getRead);
router.delete('/:id', vouchersCtrls.deleteDelete);

module.exports = router;
