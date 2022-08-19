const Router = require('express');
const favoriteController = require('../controllers/favorite-controller');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-favorite', favoriteController.addFavoriteProduct);
router.get('/favorites', authMiddleware, favoriteController.getFavorites);
router.delete('/favorite', favoriteController.removeFavoriteProduct);

module.exports = router;
