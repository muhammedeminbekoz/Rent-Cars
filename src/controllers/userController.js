const client = require('../db/connection');
const query = require('../db/queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../middlewares/authentication/auth');
const emailModule = require('../utils/email');
const { isNullOrUndefinedOrEmpty } = require('../utils/helpers/valueHelper');

const getUserById = (req, res) => {
    const { userId } = req.body;
    client.execute(query.getUserById, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "server error" });
        }
        else {
            const userData = result?.rows[0];

            res.status(200).json({
                success: true, data: {
                    id: userData.id,
                    firstname: userData.firstname,
                    lastname: userData.lastname
                }
            })
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
                        res.status(500).json({ success: false, message: "server error" });
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
    let { firstname, lastname, currentPassword, newPassword, newPasswordAgain } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verifyedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = verifyedToken.sub.userId
    console.log('userId :', userId);

    client.execute(query.getUserById, [userId], async (err, result) => {
        if (err) {
            res.status(500).json({ success: true, message: "server error" });
        }

        if (isNullOrUndefinedOrEmpty(firstname)) {
            console.log("null or undefined or empty", firstname, "type", typeof firstname)
            firstname = result.rows[0].firstname;
        }

        if (isNullOrUndefinedOrEmpty(lastname)) {
            console.log("null or undefined or empty", lastname, "type", typeof lastname)
            lastname = result.rows[0].lastname;
        }

        const comparePassword = bcrypt.compareSync(currentPassword, result?.rows[0]?.password)
        if (isNullOrUndefinedOrEmpty(currentPassword) || !comparePassword) {
            res.status(400).json({ success: false, message: "password is wrong" })
        }

        let password = "";
        if (newPassword != newPasswordAgain) res.status(400).json({ success: false, message: "We could be the same No matter what they say" })
        else if (!isNullOrUndefinedOrEmpty(newPassword)) {

            const passwordIsSame = bcrypt.compareSync(newPassword, result?.rows[0]?.password)
            if (passwordIsSame) res.status(400).json({ success: false, message: "Your password cannot be the same as the previous one" })
            else {

                password = isNullOrUndefinedOrEmpty(newPassword) && isNullOrUndefinedOrEmpty(newPasswordAgain)
                    ? bcrypt.hashSync(currentPassword, 10) : bcrypt.hashSync(newPassword, 10);

            }
        } else {
            password = bcrypt.hashSync(currentPassword, 10);
        }
        console.log("değerler : ", firstname, lastname, password, userId)
        client.execute(query.updateUser, [firstname, lastname, password, userId], (err, result) => {
            if (err) res.status(400).json({ success: false, message: "server error" });
            res.status(200).json({ success: true, message: "user updated sucessfully" })
        })


    })
}

const deleteUser = (req, res) => {
    const { userId, password } = req.body;

    client.execute(query.getUserPassword, [userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "server error" });
        }
        else {
            if (!result?.rows[0]?.password) {
                res.status(500).json({ success: false, message: "böyle bir kayıt yok" })
            }
            else {
                const comparedPassword = bcrypt.compareSync(password, result?.rows[0]?.password)
                if (!comparedPassword) {
                    res.status(400).json({ success: false, message: "password is wrong" });
                } else {
                    client.execute(query.deleteUser, [userId], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ success: false, message: "server error" });
                        } else {
                            res.status(200).json({ success: true, message: "user deleted successfully" });
                        }

                    })
                }

            }
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

const iForgotMyPassword = (req, res) => {
    const { email } = req.body;
    client.execute(query.checkUserExsist, [email], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "server error" });
        } else {
            if (!result?.rows[0]) {
                res.status(400).json({ success: false, message: "No such email found" });
            } else {
                emailModule.sendResetPasswordEmail(email);
                res.status(200).json({ success: true, message: "An email has been sent to change your password." });
            }

        }
    })
}

const resetPassword = (req, res) => {
    const { id, password, passwordAgain } = req.body;
    if (isNullOrUndefinedOrEmpty(password || passwordAgain))
        res.status(400).json({ success: false, message: "These fields cannot be left blank" })

    if (password != passwordAgain) {
        res.status(400).json({ success: false, message: "We could be the same No matter what they say" });
    }
    client.execute(query.getUserById, [id], (err, result) => {
        if (err) res.status(400).json({ success: false, message: "server error" });

        const passwordIsSame = bcrypt.compareSync(password, result?.rows[0]?.password)
        if (passwordIsSame) {
            res.status(400).json({ success: false, message: "Your password cannot be the same as the previous one" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log(hashedPassword);
        client.execute(query.resetPassword, [hashedPassword, id], (err, result) => {
            if (err) {
                res.status(500).json({ success: false, message: "server error" });
            }
            res.status(200).json({ success: true, message: "Your password has been changed successfully" })

        })


    })


}

module.exports = {
    getUserById,
    register,
    login,
    update,
    deleteUser,
    verifyUser,
    iForgotMyPassword,
    resetPassword
};