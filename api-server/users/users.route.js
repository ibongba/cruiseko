var express = require('express');
var router = express.Router();
const cont  = require('./users.cont')
const mw = require('../middlewares/auth')

// const meb = require('../utils/meb')

// router.post('/register',user.register)

router.post('/check-email',cont.checkEmail)
router.post('/login',cont.login)
router.post('/register',cont.register)
router.post('/gen-id',cont.genUserId)


router.get('/profile',mw.jwt('user'),cont.profile)

router.get('/',cont.index)
router.put('/:id',cont.update)
router.delete('/:id',cont.delete)

module.exports = router;