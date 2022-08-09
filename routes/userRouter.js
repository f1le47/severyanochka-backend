const Router = require('express');
const router = new Router();
const userController = require('../controllers/user-controller');

router.post('/registration', userController.registration);
router.post('/resend-code', userController.resendCode);
router.post('/confirm-code', userController.confirmCode);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/restore', userController.restorePassword);
router.post('/new-password', userController.newPassword);
router.get('/auth', userController.checkAuth);

module.exports = router;
