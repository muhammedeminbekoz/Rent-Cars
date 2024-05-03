const router = require('express').Router();
const carsController = require('../controllers/carsController');

router.post('/addCar', carsController.addCar);
router.get('/:officename', carsController.listCarsByOffice);



module.exports = router;