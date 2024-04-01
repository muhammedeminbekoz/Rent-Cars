const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);
router.post('/addUser', userController.addUser);


module.exports = router;