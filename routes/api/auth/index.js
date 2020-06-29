var express = require('express');
var router = express.Router();
const authCtrl = require('./auth.ctrl');

router.get('/', authCtrl.getList);
router.get('/info/:id', authCtrl.getInfo);
router.get('/check', authCtrl.getCheck);
router.get('/check2', authCtrl.getCheck2);

/* POST users listing. */

router.post('/signup', authCtrl.postSignup);
router.post('/login', authCtrl.postLogin);
router.post('/logout', authCtrl.postLogout);
router.post('/post', authCtrl.transaction);

router.delete('/delete/:id', authCtrl.deleteDelete);
router.patch('/update/:id', authCtrl.patchUpdate);

module.exports = router;
