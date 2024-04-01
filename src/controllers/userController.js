const client = require('../db/connection');



const getUsers = (req, res) => {
    const query = 'SELECT * FROM users';

    client.execute(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            res.status(200).json({ data: result.rows })
        }

    })
}




module.exports = {
    getUsers,
};