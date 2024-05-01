const router = require('express').Router();
const rental = require('../controllers/rentalController');

router.get('/getRentalInfo', rental.getRentalsInfo);
router.post('/addResultOfRental', rental.addResultOfRental);

module.exports = router;