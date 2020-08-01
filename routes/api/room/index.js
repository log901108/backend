var express = require('express');
var router = express.Router();

const roomsCtrls = require('./rooms.ctrl');

const wrapper = require('../../../util/asyncwrapper');

const mcheckchache = require('../auth/middle/mcheckcache');

router.post('/', wrapper(roomsCtrls.postCreate));
router.get('/:id', mcheckchache, wrapper(roomsCtrls.getRead));
router.delete('/:id', wrapper(roomsCtrls.deleteDelete));
router.post('/profile', wrapper(roomsCtrls.postProfile));
router.get('/profile/:name', wrapper(roomsCtrls.getProfile));

module.exports = router;
