require('module-alias/register')
const router = require('express').Router();
const carsController = require('@controllers/carsController');

router.post('/add-car', carsController.addCar);
router.get('/change-car-status', carsController.changeCarStatus);
router.get('/list-cars/:officename', carsController.listCarsByOffice);


module.exports = router;