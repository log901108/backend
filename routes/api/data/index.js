var express = require('express');
var router = express.Router();

const dataCtrl = require('./data.ctrl');

const wrapper = require('../../../util/asyncwrapper');
const mcheckcache = require('../auth/middle/mcheckcache');

router.post('/', wrapper(dataCtrl.postCreate));
router.get('/:id', mcheckcache, wrapper(dataCtrl.getRead));
router.get('/', mcheckcache, wrapper(dataCtrl.getList));
router.patch('/:id', mcheckcache, wrapper(dataCtrl.patchUpdate));
router.patch(
  '/unmanaged/:id',
  mcheckcache,
  wrapper(dataCtrl.patchUpdateUnmanaged)
);
router.post('/bulkupdate', wrapper(dataCtrl.postBulkUpload));
router.delete('/:id', wrapper(dataCtrl.deleteDelete));

module.exports = router;
