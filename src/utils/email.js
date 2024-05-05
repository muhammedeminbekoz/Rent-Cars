const nodemailer = require('nodemailer');
require('dotenv').config();



let verifyCode;

const verificationEmailTemplate = () => {
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
};


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD
    }
});

const resetPasswordEmailTemplate = () => {
    return `
   <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parola Sıfırlama Talebi</title>
</head>
<body>
    <p>Merhaba</p>
    <p>Parolanızı sıfırlamak için bize iletmiş olduğunuz talep aldık. Parolanızı sıfırlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
    <p><a href="https://bys.ktu.edu.tr/" target="_blank">Parolamı Sıfırla</a></p>
    <p>Bağlantıyı tıkladığınızda, sizi parola sıfırlama sayfasına yönlendireceğiz. Yeni bir parola oluşturmak için talimatları izleyebilirsiniz.</p>
    <p>Eğer parolanızı sıfırlamak istemediyseniz, bu e-postayı görmezden gelebilirsiniz. Güvenliğiniz için, bu e-posta üzerinden parolanızı sıfırlamanızı öneririz.</p>
    <p>Herhangi bir sorunuz varsa, bizimle iletişime geçmekten çekinmeyin.</p>
    Rent-Cars<br>

</body>
</html>`
}


const selectResetPasswordMailOptions = (to) => {
    return mailOptions = {

        from: 'm.eminbekoz19@gmail.com',
        to: to,
        subject: 'Reset your password',
        html: resetPasswordEmailTemplate(),
    }
}

const selectVerificationMailOptions = (to) => {
    return mailOptions = {

        from: 'm.eminbekoz19@gmail.com',
        to: to,
        subject: 'Verify your account',
        html: verificationEmailTemplate(),
    }
}



const sendVerificationEmail = (to) => {
    console.log('mail gönderimi başladı');
    verifyCode = Math.floor(Math.random() * 900000) + 100000;
    transporter.sendMail(selectVerificationMailOptions(to), (err, data) => {
        if (err) console.log(err);
        else {
            console.log('mail gönderildi', verifyCode);
        }
    })
    console.log('mail gönderimi tamalandı');
}

const sendResetPasswordEmail = (to) => {
    console.log('mail gönderimi başladı');
    verifyCode = Math.floor(Math.random() * 900000) + 100000;
    transporter.sendMail(selectResetPasswordMailOptions(to), (err, data) => {
        if (err) console.log(err);
        else {
            console.log('mail gönderildi', verifyCode);
        }
    })
    console.log('mail gönderimi tamalandı');
}




module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail,
    verifyCode
};
