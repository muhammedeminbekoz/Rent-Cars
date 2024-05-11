const client = require('../db/connection');
const query = require('../db/queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../middlewares/authentication/auth');
const emailModule = require('../utils/email');
const { isNullOrUndefinedOrEmpty } = require('../utils/helpers/valueHelper');

const getUserById = (req, res) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    const verifyedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = verifyedToken.sub.userId;
    client.execute(query.getUserById, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "server error" });
        }
        else {
            const userData = result?.rows[0];

            res.status(200).json({
                success: true, data: {
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email
                }
            })
        }
    })
}

const register = (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    client.execute(query.checkUserExsist, [email], (err, result) => {
        if (err) {
            res.status(400).json({ success: false, message: "server error" })
        }
        else if (result.rowLength) {
            res.status(409).json({ message: 'user already exist' })
        }
        else {
            const verifyCode = emailModule.sendVerificationEmail(email)?.toString();
            const hashedPassword = bcrypt.hashSync(password, 10);
            client.execute(query.addUser, [firstname, lastname, email, hashedPassword, verifyCode], (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: "server error" });
                }
                else {
                    res.status(200).json({
                        message: 'User added successfully', data: {
                            firstname,
                            lastname,
                            email,
                        }
                    });
                }
            })
        }

    })
}

const login = (req, res) => {
    const { email, password } = req.body;

    client.execute(query.checkUserExsist, [email], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "server error" });
        }
        else {
            if (!result.rowLength) {
                res.status(400).json({ message: 'user not exsist' })
            } else {
                client.execute(query.chechkUserisVerifyed, [email], (err, result) => {
                    if (err) {
                        res.status(500).json({ success: false, message: "server error" });
                    }
                    else {
                        if (!result.rows[0].isverify) {
                            res.status(400).json({ success: false, message: "account is not verifyed" });
                        }
                        else {
                            const hashedPassword = bcrypt.compareSync(password, result.rows[0].password);
                            if (hashedPassword) {
                                const jwtToken = createToken(result.rows[0].id);
                                res.status(200).json({ message: 'login succesful', token: jwtToken });
                            } else {
                                res.status(400).json({ message: 'email or password is wrong' });
                            }
                        }
                    }
                })
            }
        }
    })


}

const update = (req, res) => {
    let { firstname, lastname, currentPassword, newPassword, newPasswordAgain } = req.body;
    const token = req?.headers?.authorization?.split(' ')[1];
    const verifyedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = verifyedToken.sub.userId

    client.execute(query.getUserById, [userId], async (err, result) => {
        if (err) {
            res.status(500).json({ success: true, message: "server error" });
        }

        if (isNullOrUndefinedOrEmpty(firstname)) {
            firstname = result.rows[0].firstname;
        }

        if (isNullOrUndefinedOrEmpty(lastname)) {
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

    try {

        client.execute(query.checkUserExsist, [email], (err, result) => {
            if (err) {
                res.status(400).json({ success: false, meessage: "server error" })
            }

            else if (!result?.rows[0]?.email) {
                res.status(404).json({ success: false, message: "user not found" })
            }

            else {

                client.execute(query.verifyUser, [email], (err, result) => {
                    if (err) {
                        res.status(500).json({ success: false, message: "server error" });
                    }
                    else {
                        const userId = result?.rows[0]?.id;

                        client.execute(`SELECT verifycode from users WHERE id = ?`, [userId], (err, result) => {
                            if (err) {
                                res.status(500).json({ success: false, message: "server error" });
                            }
                            else {
                                const verifyCode = result?.rows[0]?.verifycode;
                                if (userVerifyCode === verifyCode) {
                                    client.execute('UPDATE users SET isverify = true WHERE id = ?', [userId], (err, result) => {
                                        if (err) {
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
        })
    }
    catch (err) {
        res.status(404).json({ success: false, message: "user not found catch" })
    }


}

const sendEmailAgain = (req, res) => {
    try {
        const { email } = req.body;

        client.execute(query.checkUserExsist, [email], (err, result) => {
            if (err) res.status(400).json({ success: false, message: "server error ", error: err });
            else if (!result?.rows[0]?.email) {
                res.status(404).json({ success: false, message: "User not found, If you don't have an account, please register" })
            }
            else {
                client.execute('SELECT id FROM users WHERE email = ? ALLOW FILTERING', [email], async (err, result) => {
                    if (err) res.status(400).json({ success: false, message: "server error ", error: err });

                    const userId = result?.rows[0]?.id;
                    const verifyCode = emailModule.sendVerificationEmail(email)?.toString();

                    client.execute('UPDATE users SET verifycode = ? WHERE id = ?', [verifyCode, userId], (err, result) => {
                        if (err) res.status(400).json({ success: false, message: "server error", error: err });

                        res.status(200).json({ success: true, message: "email sended successfully", data: verifyCode })

                    })
                })
            }

        })


    } catch (err) {
        res.status(400).json({ success: false, message: "An error occurred while sending the e-mail, please try again." })
    }
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
    if (isNullOrUndefinedOrEmpty(password || passwordAgain)) {
        res.status(400).json({ success: false, message: "These fields cannot be left blank" })
    }
    else if (password != passwordAgain) {
        res.status(400).json({ success: false, message: "We could be the same No matter what they say" });
    }
    else {
        client.execute(query.getUserById, [id], (err, result) => {
            if (err) res.status(400).json({ success: false, message: "server error" });
            else {
                const passwordIsSame = bcrypt.compareSync(password, result?.rows[0]?.password)
                if (passwordIsSame) {
                    res.status(400).json({ success: false, message: "Your password cannot be the same as the previous one" });
                }
                else {
                    const hashedPassword = bcrypt.hashSync(password, 10);
                    client.execute(query.resetPassword, [hashedPassword, id], (err, result) => {
                        if (err) {
                            res.status(500).json({ success: false, message: "server error" });
                        }
                        res.status(200).json({ success: true, message: "Your password has been changed successfully" })

                    })
                }
            }
        })
    }

}

module.exports = {
    getUserById,
    register,
    login,
    update,
    deleteUser,
    verifyUser,
    sendEmailAgain,
    iForgotMyPassword,
    resetPassword
};