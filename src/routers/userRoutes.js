const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../middlewares/validation/userValidation')
const authorization = require('../middlewares/authentication/auth');


router.get('/get*er', authorization.tokenCheck, userController.getUsers);
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);


module.exports = router;