require('module-alias/register')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const client = require('@db/connection');
const query = require('@db/queries');


const createToken = (userId) => {
    const payload = {
        sub: {
            userId: userId
        }
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '1d'

    });

    return token;

}

const tokenCheck = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(403).json({ success: false, message: 'Bu sayfaya erişiminiz bulunmamaktadır' });
    } else {
        try {
            const token = authHeader.split(' ')[1]
            const verifyedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            client.execute(query.getUserById, [verifyedToken.sub.userId], (err, result) => {
                if (err) {
                    res.status(403).json({ success: false, message: 'token uyuşmuyor lütfen giriş yapınız' })
                }
                else {
                    next();
                }
            })
        }
        catch (err) {
            res.status(403).json({ success: false, message: "bad request" })
        }



    }



}






module.exports = {
    createToken,
    tokenCheck
}