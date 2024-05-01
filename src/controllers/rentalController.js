const client = require('../db/connection');
const query = require('../db/queries');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment().format();


const getRentalsInfo = (req, res) => {
    client.execute(query.getRentalInfo, (err, result) => {
        if (err) {
            console.log(err, 'query error');
        }
        else {
            res.status(400).json({ success: true, data: result.rows[0] });
            console.log(result.rows[0]);
            console.log('işlem başarılı');
        }
    })
}



const addResultOfRental = (req, res) => {
    const { carId, firstname, lastname, startingDate, endingDate, licanceNo, tckNo, dob, dropoffDate, dropoffOfficeId, phoneNumber, pickupDate, pickupOfficeId, }
        = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const verifyedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = verifyedToken.sub.userId;
    console.log('userId :', userId);


    client.execute(query.addResultOfRental,
        [carId, firstname, lastname, startingDate, endingDate, licanceNo, tckNo, dob, dropoffDate, dropoffOfficeId, phoneNumber, pickupDate, pickupOfficeId, userId],
        { prepare: true },
        (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({ success: false, message: "server error" });
            }
            res.status(200).json({ success: true, data: result })

        }
    )
}




module.exports = {
    getRentalsInfo,
    addResultOfRental
}