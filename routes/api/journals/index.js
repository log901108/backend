var express = require('express');
var router = express.Router();

const journalsCtrls = require('./journals.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', journalsCtrls.postCreate);
router.get('/:id', mcheckchache, journalsCtrls.getRead);
router.delete('/:id', journalsCtrls.deleteDelete);
router.post('/profile', journalsCtrls.postProfile);
router.get('/profile/:name', journalsCtrls.getProfile);

module.exports = router;
