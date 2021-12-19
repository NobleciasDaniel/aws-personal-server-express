const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    secure: true
})

exports.send = function (data, callback) {
    const {to, subject, text} = data;
    console.log(data);
    if (!to || !subject || !text) return new Error('parameter not valid');
    const mailData = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html: '<h1>Su contraseña temporal es: </h1>'
    }
    transporter.sendMail(mailData, callback)
};
