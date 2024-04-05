const jwt = require('jsonwebtoken');
require('dotenv').config();
const client = require('../../db/connection');
const query = require('../../db/queries');


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

const tokenCheck = async (req, res, next) => {
    console.log('tokenCheck içerisinde');
    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    if (!authHeader) {
        res.status(400).json({ success: false, message: 'Bu sayfaya erişiminiz bulunmamaktadır' });
    } else {
        const token = authHeader.split(' ')[1]
        const verifyedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(verifyedToken.sub.userId);
        client.execute(query.getUserById, [verifyedToken.sub.userId], (err, result) => {
            if (err) console.log(err)
            else {

                next();
            }
        })



    }



}






module.exports = {
    createToken,
    tokenCheck
}