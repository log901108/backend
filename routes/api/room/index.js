var express = require('express');
var router = express.Router();

const roomsCtrls = require('./rooms.ctrl');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', roomsCtrls.postCreate);
router.get('/:id', mcheckchache, roomsCtrls.getRead);
router.delete('/:id', roomsCtrls.deleteDelete);
router.post('/profile', roomsCtrls.postProfile);
router.get('/profile/:name', roomsCtrls.getProfile);

module.exports = router;
