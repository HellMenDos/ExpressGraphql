const nodemailer = require('nodemailer');
const config = require('../config')


let transport = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD
    }
});


module.exports  = function sendEmail(to, subject, text) {
    transport.sendMail({
        from: config.SYS_EMAIL,
        to,
        subject,
        text
    });
}
