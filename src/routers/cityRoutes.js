const router = require('express').Router();
const cityController = require('@controllers/cityController');
const officeController = require('@controllers/officeController');

router.get('/list-city/:cityname', cityController.listCity);
router.post('/add-office', officeController.addOffice);
router.get('/offices', officeController.listOffices);




module.exports = router;