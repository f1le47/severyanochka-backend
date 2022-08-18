const Router = require('express');
const discountController = require('../controllers/discount-controller');
const router = new Router();

router.post('/add-discount', discountController.addDiscount);
router.put('/discount', discountController.changeDiscount);
router.delete('/discount', discountController.deleteDiscount);

module.exports = router;
