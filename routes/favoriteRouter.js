const Router = require('express');
const favoriteController = require('../controllers/favorite-controller');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-favorite', favoriteController.addFavoriteProduct);
router.get('/favorites', authMiddleware, favoriteController.getFavorites);
router.delete('/favorite', authMiddleware, favoriteController.removeFavoriteProduct);
router.get('/favorite-pages', authMiddleware, favoriteController.getFavoritePages);

module.exports = router;
