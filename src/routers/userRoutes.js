const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../middlewares/validation/userValidation')

router.get('/get*er', userController.getUsers);
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);


module.exports = router;