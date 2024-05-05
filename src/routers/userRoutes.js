const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, updateValidation, verifyValidation } = require('../middlewares/validation/userValidation')
const authorization = require('../middlewares/authentication/auth');

router.get('/getuser', authorization.tokenCheck, userController.getUserById);
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.put('/update', authorization.tokenCheck, updateValidation, userController.update);
router.post('/verifyEmail', verifyValidation, userController.verifyUser);
router.post('/sendEmailAgain', userController.sendEmailAgain);
router.delete('/deleteUser', userController.deleteUser);
router.get('/iForgotMyPassword', userController.iForgotMyPassword);
router.post('/resetPassword', userController.resetPassword);

module.exports = router;