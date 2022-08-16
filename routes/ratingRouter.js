const Router = require('express');
const router = new Router();
const RatingController = require('../controllers/rating-controller');

router.post('/add-rate', RatingController.addRate);
router.put('/rate', RatingController.changeRate);
router.delete('/rate', RatingController.deleteRate);

module.exports = router;
