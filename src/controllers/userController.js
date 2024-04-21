const client = require('../db/connection');
const query = require('../db/queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../middlewares/authentication/auth');
const emailModule = require('../utils/email');

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
                        emailModule.sendAuthanticationEmail(email);
                        const authCode = emailModule.authanticationCode;
                        console.log('isim:' + firstname, 'email:' + email)
                        res.status(200).json({
                            message: 'User added successfully', data: [
                                firstname,
                                lastname,
                                email,
                                authCode
                            ]


                        });
                    }
                })
            }
        }
    })
    console.log('registiration tamamlandı')
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

const update = async (req, res) => {
    const { firstname, lastname } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verifyedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = verifyedToken.sub.userId
    console.log('userId :', userId);
    /* const bufferedUserId = await Buffer.from(userId)
    console.log(userId);
    console.log(bufferedUserId); */

    await client.execute(query.updateUser, [firstname, lastname, userId], (err, result) => {
        if (err) {
            res.status(400).json({ success: false, message: "query error" });
            console.log('query error: ', err);
        }
        else {
            res.status(200).json({ success: true, data: [firstname, lastname], message: 'user updated successfully' });
        }
    })

}

module.exports = {
    getUsers,
    register,
    login,
    update
};