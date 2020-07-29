var express = require('express');
var router = express.Router();

var wrapper = require('../../../util/asyncwrapper');

const tblsCtrls = require('./tbls.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/sync', wrapper(tblsCtrls.postCreateSync));
router.get('/:id', wrapper(mcheckchache, tblsCtrls.getRead));
router.delete('/:id', wrapper(tblsCtrls.deleteDelete));

router.post('/insert', wrapper(tblsCtrls.postInsert));

module.exports = router;
