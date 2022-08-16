const Router = require('express');
const router = new Router();
const CategoryContoller = require('../controllers/category-controller');

router.post('/add-category', CategoryContoller.addCategory);
router.put('/category', CategoryContoller.changeCategory);
router.delete('/category', CategoryContoller.deleteCategory);

module.exports = router;
