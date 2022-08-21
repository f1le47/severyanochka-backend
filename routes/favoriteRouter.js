const Router = require('express');
const favoriteController = require('../controllers/favorite-controller');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-favorite', authMiddleware, favoriteController.addFavoriteProduct);
router.get('/favorites', authMiddleware, favoriteController.getFavorites);
router.delete('/favorite', authMiddleware, favoriteController.removeFavoriteProduct);
router.get('/favorite-pages', authMiddleware, favoriteController.getFavoritePages);
router.get('/favorite-ids', authMiddleware, favoriteController.favoriteProductsIds);

module.exports = router;
