const Router = require('express');
const router = new Router();
const categoryContoller = require('../controllers/category-controller');

router.post('/add-category', categoryContoller.addCategory);
router.put('/category', categoryContoller.changeCategory);
router.delete('/category', categoryContoller.deleteCategory);
router.get('/categories', categoryContoller.getCategories);

module.exports = router;
