const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);



module.exports = router;