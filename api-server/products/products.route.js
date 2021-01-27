var express = require('express');
var router = express.Router();
const product = require('../products/products.cont')
// const addon_route = require('./addon/addon.route')
// const backend = require('./backend.cont')
const mw = require('../middlewares/auth')



// router.use('/addon',addon_route)


router.get('/',product.getAll)
router.post('/',product.create)
router.post('/duplicate',product.duplicateProduct)
router.post('/publish',product.updatePublishStatus)
router.get('/:id',product.getOne)
router.put('/:id',product.update)

router.delete('/:id',product.delete)

router.get('/:id/related',product.getRelatedProduct)

module.exports = router;