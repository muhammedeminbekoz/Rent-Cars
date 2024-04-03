const router = require('express').Router();
const cityController = require('../controllers/cityController');

router.get('/listcity/:cityname', cityController.listCity);

module.exports = router;