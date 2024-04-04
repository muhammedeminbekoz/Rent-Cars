const client = require('../db/connection');
const query = require('../db/queries');


const getUsers = (req, res) => {


    client.execute(query.getUsers, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json({ data: result.rows })
        }

    })
}

const register = (req, res) => {
    console.log('registiration started')
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
                        res.status(200).json({ message: 'User added successfully', data: req.body });
                    }
                })
            }
        }
    })

}

const login = (req, res) => {
    const { email, password } = req.body;

    client.execute(query.checkUserExsist, [email], (err, result) => {
        if (err) {
            console.log('query error', err);
        }
        else {
            if (!result.rowLength) {
                console.log('email or password is wrong')
                res.status(400).json({ message: 'email or password is wrong' })
            } else {
                const userPassword = result.rows[0].password;
                if (password == userPassword) {
                    console.log('user login with email', result.rows[0].email);
                    res.status(200).json({ message: 'login succesful' });
                } else {
                    console.log('email or password is wrong')
                    res.status(400).json({ message: 'email or password is wrong' });
                }
            }
        }
    })


}

module.exports = {
    getUsers,
    register,
    login
};