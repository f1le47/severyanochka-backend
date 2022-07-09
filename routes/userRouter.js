const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/confirm-code', userController.confirmCode);
router.post('/login', userController.login);
router.post('/restore', userController.restorePassword);
router.post('/new-password')
router.get('/auth', userController.check);

module.exports = router;
