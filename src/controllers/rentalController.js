const client = require('../db/connection');
const query = require('../db/queries');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { isNullOrUndefinedOrEmpty } = require('../utils/helpers/valueHelper');
moment().format();



const getRentalsInfo = (req, res) => {
    client.execute(query.getRentalInfo, (err, result) => {
        if (err) {
            console.log(err, 'query error');
        }
        else {
            res.status(400).json({ success: true, dropoffDate: result?.rows });

        }
    })
}



const addResultOfRental = (req, res) => {
    try {
        const { carId, firstname, lastname, startingDate, endingDate, licanceNo, tckNo, dob, dropoffDate, dropoffOfficeId, phoneNumber, pickupDate, pickupOfficeId, }
            = req.body;
        const token = req?.headers?.authorization.split(' ')[1];

        if (isNullOrUndefinedOrEmpty(token)) res.status(403).json({ success: false, message: "Only logged in users can rent" })
        else {
            const verifyedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!verifyedToken) {
                res.status(401).json({ success: false, message: "Only logged in users can rent" })
            }
            const userId = verifyedToken.sub.userId;

            client.execute(query.addResultOfRental,
                [carId, firstname, lastname, startingDate, endingDate, licanceNo, tckNo, dob, dropoffDate, dropoffOfficeId, phoneNumber, pickupDate, pickupOfficeId, userId],
                { prepare: true },
                (err, result) => {
                    if (err) res.status(500).json({ success: false, message: "server error" })

                    client.execute(query.changeCarInfos, [false, dropoffOfficeId, dropoffDate, carId], { prepare: true }, (err, result) => {
                        if (err) res.status(500).json({ success: false, message: "server error" });
                    })

                    res.status(200).json({ success: true, message: "rental saved" })

                }
            )
        }

    }
    catch (err) {
        res.status(500).json({ success: false, message: "Token expired error please log in again !!!" })
    }

}




module.exports = {
    getRentalsInfo,
    addResultOfRental
}