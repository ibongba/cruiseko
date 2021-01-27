var express = require('express');
var router = express.Router();
const booking = require('./booking.cont')
const payment = require('./payment.cont')
const slip = require('./transfer_slip.cont')
// const backend = require('./backend.cont')
const mw = require('../middlewares/auth')


router.get('/available-boat',booking.checkAvailableBoat)
router.post('/paypal-apr',payment.paypalApprove)

router.use('/*',mw.jwt(['user','admin']))

// const protect_method_admin = ['get','delete']
// protect_method_admin.forEach(val => router[val]('/*',mw.jwt('admin')))

// const protect_method = ['post']
// protect_method.forEach(val => router[val]('/*',mw.jwt('user')))

router.get('/slip',slip.getAll)

router.post('/slip',slip.create)
router.get('/slip/:sid',slip.getOne)
router.put('/slip/:sid',slip.update)
router.delete('/slip/:sid',slip.delete)

router.get('/',booking.getAll)

router.post('/',booking.create)
router.get('/:id',booking.getOne)
router.put('/:id',booking.update)
// router.delete('/:id',com.delete)
// router.post('/order',com.updateOrder)

module.exports = router;