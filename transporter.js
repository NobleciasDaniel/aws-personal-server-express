const nodemailer = require('nodemailer');
const RedisClient = require('./redis-client').default;
const client = new RedisClient({
    host: '127.0.0.1',
    port: 6379,
    password: 'X7ZIcVHLDGfBbnxakUWjuuK11uAg9g7kMHiUo2N24eogKzrPLW09X6/EjZI+0YyO36XkgwDlmn+7yJWb'
});
console.log(client.setKey({
    key: 'hola',
    value: 'hola'
}).then(resp => {
    console.log(resp);
}));
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
