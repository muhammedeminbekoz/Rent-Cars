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
        const verifyCode = emailModule.verifyCode.toString();
        console.log(verifyCode);
        if (err) console.log(err);
        else {
            if (result.rowLength) {
                res.status(409).json({ message: 'user already exist' })
            } else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                client.execute(query.addUser, [firstname, lastname, email, hashedPassword, verifyCode], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        emailModule.sendVerificationEmail(email);
                        console.log('isim:' + firstname, 'email:' + email)
                        res.status(200).json({
                            message: 'User added successfully', data: [
                                firstname,
                                lastname,
                                email,
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
                client.execute(query.chechkUserisVerifyed, [email], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ success: false, message: "server error" });
                    }
                    else {
                        if (!result.rows[0].isverify) {
                            res.status(400).json({ success: false, message: "account is not verifyed" });
                        }
                        else {
                            const hashedPassword = bcrypt.compareSync(password, result.rows[0].password);
                            console.log("hashed password :   ", hashedPassword);
                            if (hashedPassword) {
                                const jwtToken = createToken(result.rows[0].id);
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
        }
    })


}

const update = async (req, res) => {
    const { firstname, lastname } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verifyedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = verifyedToken.sub.userId
    console.log('userId :', userId);

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

const deleteUser = (req, res) => {
    const { userId } = req.body;
    client.execute(query.deleteUser, [userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "server error" });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true, message: "user deleted successfully" });
        }
    })

}

const verifyUser = (req, res) => {
    const { email, userVerifyCode } = req.body;

    client.execute(query.verifyUser, [email], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "server error" });
        }
        else {
            const userId = result.rows[0].id;
            console.log(userId);

            client.execute(`SELECT verifycode from users WHERE id = ?`, [userId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: "server error" });
                }
                else {
                    const verifyCode = result?.rows[0]?.verifycode;
                    console.log(verifyCode);
                    console.log(userVerifyCode);
                    if (userVerifyCode === verifyCode) {
                        client.execute('UPDATE users SET isverify = true WHERE id = ?', [userId], (err, result) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ success: false, message: "server error" });
                            }
                            else {
                                res.status(200).json({ success: true, messsage: "verification successful" });
                            }
                        })
                    }
                    else {
                        res.status(400).json({ success: false, message: "verify code is wrong!" });
                    }
                }
            })


        }
    })
}


module.exports = {
    getUsers,
    register,
    login,
    update,
    deleteUser,
    verifyUser
};