var express = require('express');
var router = express.Router();

const vouchersCtrls = require('./vouchers.ctrl');
const voucherassociationsCtrls = require('./voucher_associations.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/create', vouchersCtrls.postCreate);
router.get('/list', mcheckchache, vouchersCtrls.getList);
router.get('/list/:id', mcheckchache, vouchersCtrls.getRead);
router.delete('/list/:id', vouchersCtrls.deleteDelete);

router.post('/association', voucherassociationsCtrls.postCreate);
router.get('/association/list', voucherassociationsCtrls.getList);
router.get('/association/:id', mcheckchache, voucherassociationsCtrls.getRead);
router.delete('/association/:id', voucherassociationsCtrls.deleteDelete);

module.exports = router;
