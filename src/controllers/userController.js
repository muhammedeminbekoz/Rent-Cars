const client = require('../db/connection');
const query = require('../db/queries');
const bcrypt = require('bcrypt');
const { createToken } = require('../middlewares/authentication/auth');

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
                const hashedPassword = bcrypt.hashSync(password, 10);
                client.execute(query.addUser, [firstname, lastname, email, hashedPassword], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        res.status(200).json({
                            message: 'User added successfully', data: [
                                firstname,
                                lastname,
                                email
                            ]


                        });
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
                const hashedPassword = bcrypt.compareSync(password, result.rows[0].password);

                if (hashedPassword) {
                    const jwtToken = createToken(result.rows[0].id);
                    console.log(jwtToken);
                    console.log('user login with email', result.rows[0]);
                    res.status(200).json({ message: 'login succesful', token: jwtToken });
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