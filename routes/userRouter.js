const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/send-code', userController.sendCode);
router.post('/confirm-code', userController.confirmCode);
router.post('/login', userController.login);
router.post('/restore', userController.restorePassword);
router.post('/new-password', userController.newPassword)
router.get('/auth', userController.check);

module.exports = router;
