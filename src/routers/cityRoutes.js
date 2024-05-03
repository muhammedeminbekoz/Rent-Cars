const router = require('express').Router();
const cityController = require('../controllers/cityController');
const officeController = require('../controllers/officeController');
const carsController = require('../controllers/carsController');

router.get('/listcity/:cityname', cityController.listCity);
router.post('/addOffice', officeController.addOffice);
router.get('/offices', officeController.listOffices);




module.exports = router;