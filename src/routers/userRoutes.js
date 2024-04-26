const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, updateValidation, verifyValidation } = require('../middlewares/validation/userValidation')
const authorization = require('../middlewares/authentication/auth');

router.get('/get*er', authorization.tokenCheck, userController.getUsers);
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.put('/update', authorization.tokenCheck, updateValidation, userController.update);
router.post('/verifyEmail', userController.verifyUser);
router.delete('/deleteUser', userController.deleteUser);
module.exports = router;