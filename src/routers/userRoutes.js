const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, updateValidation, verifyValidation } = require('../middlewares/validation/userValidation')
const authorization = require('../middlewares/authentication/auth');

router.get('/get-user-by-id', authorization.tokenCheck, userController.getUserById);
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.put('/update-user', authorization.tokenCheck, updateValidation, userController.update);
router.post('/verify-email', verifyValidation, userController.verifyUser);
router.post('/send-email-again', userController.sendEmailAgain);
router.delete('/delete-user', userController.deleteUser);
router.get('/i-forgoy-my-password', userController.iForgotMyPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;