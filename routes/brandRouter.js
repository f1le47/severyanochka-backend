const Router = require('express');
const router = new Router();
const BrandController = require('../controllers/brand-controller');

router.post('/add-brand', BrandController.addBrand);
router.put('/brand', BrandController.changeBrand);
router.delete('/brand', BrandController.deleteBrand);

module.exports = router;
