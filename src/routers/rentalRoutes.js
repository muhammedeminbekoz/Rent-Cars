const router = require('express').Router();
const rentalInfo = require('../controllers/rentalInfoController');

router.get('/getRentalInfo', rentalInfo.getRentalinfo);


module.exports = router;