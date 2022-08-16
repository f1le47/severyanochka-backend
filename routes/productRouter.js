const Router = require('express');
const router = new Router();
const ProductController = require('../controllers/product-controller');

router.get('/product', ProductController.getProduct);
router.post('/add-product', ProductController.addProduct);
router.put('/product', ProductController.changeProduct);
router.delete('/product', ProductController.deleteProduct);
router.get('/products', ProductController.getProducts);

module.exports = router;
