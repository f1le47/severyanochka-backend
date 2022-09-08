const Router = require('express');
const ratingController = require('../controllers/rating-controller');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-rate', authMiddleware, ratingController.addRate);
router.put('/rate', authMiddleware, ratingController.changeRate);
router.delete('/rate', authMiddleware, ratingController.deleteRate);
router.get('/rates', ratingController.getRatings);

module.exports = router;
