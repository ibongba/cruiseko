var express = require('express');
var router = express.Router();
const rec = require('./recommend.cont')
// const backend = require('./backend.cont')
const mw = require('../middlewares/auth')

const protect_method = ['post','put','delete']
protect_method.forEach(val => router[val]('/*',mw.jwt('admin')))


router.get('/products',rec.getAllProduct)
router.post('/products',rec.addProduct)
router.post('/products/order',rec.updateProductOrder)
router.delete('/products/:id',rec.deleteProduct)


router.get('/',rec.getAllCate)
router.get('/:key',rec.getOneCate)
router.post('/',rec.createCate)
router.put('/:key',rec.updateCate)
router.delete('/:key',rec.deleteCate)

module.exports = router;