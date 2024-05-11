const router = require('express').Router();
const rental = require('../controllers/rentalController');

router.get('/get-rental-info', rental.getRentalsInfo);
router.post('/add-result-of-rental', rental.addResultOfRental);

module.exports = router;