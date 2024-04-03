const router = require('express').Router();
const userController = require('../controllers/userController');
const userValidation = require('../middlewares/validation/userValidation')

router.get('/get*er', userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);


module.exports = router;