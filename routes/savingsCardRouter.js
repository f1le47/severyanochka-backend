const Router = require('express');
const savingsCardController = require('../controllers/savings-card-controller');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/create-savings-card', authMiddleware, savingsCardController.createSavingsCard);
router.get('/savings-card', authMiddleware, savingsCardController.getSavingsCard);

module.exports = router;
