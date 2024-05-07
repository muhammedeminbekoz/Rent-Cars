const router = require('express').Router();
const carsController = require('../controllers/carsController');

router.post('/addCar', carsController.addCar);
router.get('/changeCarStatus', carsController.changeCarStatus);
router.get('/listcars/:officename', carsController.listCarsByOffice);


module.exports = router;