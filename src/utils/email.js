const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD
    }
});

const mailOptions = {
    from: 'm.eminbekoz19@gmail.com',
    to: 'eminbekoz6164@gmail.com',
    subject: 'Nodemailer test',
    html: '<h1>Herkese Salam 33 Yaşım Var</h1>'
}

const sendEmail = (req, res) => {
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err);
        else {
            res.status(200).json({ success: true, message: 'mail gönderildi' })
            console.log('mail gönderildi');
        }
    })
}


module.exports = { sendEmail };
