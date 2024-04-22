const client = require('../db/connection');
const queries = require('../db/queries');


const getRentalsinfo = (req, res) => {
    client.execute(queries.getRentalInfo, (err, result) => {
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




module.exports = {
    getRentalinfo
}