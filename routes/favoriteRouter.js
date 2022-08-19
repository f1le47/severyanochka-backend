const Router = require('express');
const favoriteController = require('../controllers/favorite-controller');
const router = new Router();

router.post('/add-favorite', favoriteController.addFavoriteProduct);
router.get('/favorites', favoriteController.getFavorites);
router.delete('/favorite', favoriteController.removeFavoriteProduct)

module.exports = router;
