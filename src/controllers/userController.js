const client = require('../db/connection');
const query = require('../db/queries');


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

const addUser = (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    client.execute(query.checkUserExsist, [email], (err, result) => {
        if (err) console.log(err);
        else {
            if (result.rowLength) {
                res.status(409).json({ message: 'user already exist' })
            } else {
                client.execute(query.addUser, [firstname, lastname, email, password], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        res.status(200).json({ message: 'User added successfully', data: req.body });
                    }
                })
            }
        }
    })

}


module.exports = {
    getUsers,
    addUser
};