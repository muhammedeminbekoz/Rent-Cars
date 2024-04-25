const nodemailer = require('nodemailer');
require('dotenv').config();



const verifyCode = Math.floor(Math.random() * 900000) + 100000;

const createEmailTemplate = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            /* Genel stiller */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                padding: 20px;
            }
    
            /* Başlık stilleri */
            h1 {
                color: #333;
                margin-bottom: 20px;
            }
    
            /* İçerik stilleri */
            p {
                color: #555;
                margin-bottom: 20px;
            }
    
    
            /* Resim stilleri */
            .image-container {
                background-image: url(https://ci3.googleusercontent.com/meips/ADKq_NZiOJ5p6qlPLHF6glQv9gvnbC9rDOlb_Pq3H00WR_yNeXoQK_Qxvpz7W6LIpXEoz9v8igYnpbPk3ieVZcv9TjaWzz0GGO4kDw5APvEO5WBvkOC_TI5QmzkAkiRTGnqbmCSWiQFxf1HDBmjoQnUmvRXsFguz4vqsHMeE5voQjgxKTDySQGWpOzhqHzYLo7Q5xSEDXgQJRoH4nhB4ug=s0-d-e1-ft#https://images.squarespace-cdn.com/content/v1/51cdafc…/1540582108966-F3U16ZAM2TKHNTQG7O6F/world_head.jpg?format=2500w);
                background-size: cover;
                height: 49vh;
                width: 100%;
                display: flex;
                
            }
    
            .verification-code {
                width: 100%;
                color: white;
                font-size: 48px;
                position: absolute;
                margin: 10% 30%;
                
            }
    
            /* Footer stilleri */
            footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ccc;
                color: #777;
            }
        </style>
    </head>
    <body>
        <h1>Hoş Geldiniz!</h1>
        <div class="image-container">
            <div class="verification-code">Doğrulama Kodu:${verifyCode}</div>
        </div>
        <p>Merhaba,</p>
        <p>Hesabınız başarıyla oluşturuldu. Lütfen aşağıdaki doğrulama kodunu kullanarak hesabınızı aktive edin:</p>
        <footer>
            <p>Eğer bu e-postayı beklemiyorsanız, lütfen dikkate almayınız.</p>
        </footer>
    </body>
    </html>
        
    `





        /*  <h1>Mail Authentication</h1>
             <h2>Authentication code: ${authanticationCode} </h2>
             
             
             
             
             
             
             
             
             */
        ;
};

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD
    }
});


const selectMailOptions = (to) => {
    return mailOptions = {

        from: 'm.eminbekoz19@gmail.com',
        to: to,
        subject: 'Nodemailer test',
        html: createEmailTemplate(),
    }
}


/* const sendEmail = (req, res ,to) => {
    transporter.sendMail(selectMailOptions, (err, data) => {
        if (err) console.log(err);
        else {
            res.status(200).json({ success: true, message: 'mail gönderildi' })
            console.log('mail gönderildi');
        }
    })
} */
const sendVerificationEmail = (to) => {
    console.log('mail gönderimi başladı');
    transporter.sendMail(selectMailOptions(to), (err, data) => {
        if (err) console.log(err);
        else {
            console.log('mail gönderildi', verifyCode);
        }
    })
    console.log('mail gönderimi tamalandı');
}

module.exports = {
    sendVerificationEmail,
    verifyCode
};
