const router = require('express').Router();
const cityController = require('../controllers/cityController');
const officeController = require('../controllers/officeController');


router.get('/listcity/:cityname', cityController.listCity);
router.post('/addOffice', officeController.addOffice);
router.get('/offices/:cityname', officeController.listOfficesBycity);

module.exports = router;