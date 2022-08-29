const Router = require('express');
const basketController = require('../controllers/basket-controller');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-basket-product', authMiddleware, basketController.addBasketProduct);
router.delete('/remove-basket-product', authMiddleware, basketController.removeBasketProduct);
router.get('/basket-products', authMiddleware, basketController.getBasketProducts);
router.get('/amount-basket-products', authMiddleware, basketController.getAmountBasketProducts);

module.exports = router;
