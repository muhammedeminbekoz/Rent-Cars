const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, updateValidation } = require('../middlewares/validation/userValidation')
const authorization = require('../middlewares/authentication/auth');
const email = require('../utils/email');

router.get('/get*er', authorization.tokenCheck, userController.getUsers);
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.put('/update', authorization.tokenCheck, updateValidation, userController.update);
router.get('/sendEmail', email.sendEmail);

module.exports = router;