const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/category-controller');

router.post('/add-category', categoryController.addCategory);
router.put('/category', categoryController.changeCategory);
router.delete('/category', categoryController.deleteCategory);
router.get('/categories', categoryController.getCategories);
router.get('/get-by-category-id', categoryController.getByCategoryId);
router.get('/min-max-prices', categoryController.getMinMaxPrices);

module.exports = router;
