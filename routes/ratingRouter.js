const Router = require('express');
const ratingController = require('../controllers/rating-controller');
const router = new Router();

router.post('/add-rate', ratingController.addRate);
router.put('/rate', ratingController.changeRate);
router.delete('/rate', ratingController.deleteRate);
router.get('/rates', ratingController.getRatings);

module.exports = router;
