const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (userId) => {
    const payload = {
        sub: userId,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '1d'

    });

    return token;

}








module.exports = {
    createToken
}