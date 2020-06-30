var express = require('express');
var router = express.Router();

const journalsCtrls = require('./journals.ctrl');

router.post('/', journalsCtrls.postCreate);
router.get('/:id', journalsCtrls.getRead);
router.delete('/:id', journalsCtrls.deleteDelete);

module.exports = router;
