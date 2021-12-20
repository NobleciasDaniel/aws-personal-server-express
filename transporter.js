const nodemailer = require('nodemailer');
const RedisClient = require('./redis-client').default;
const crypto = require('crypto');
const jwt = require('njwt');

const client = new RedisClient({
    host: '127.0.0.1',
    port: 6379,
    password: 'X7ZIcVHLDGfBbnxakUWjuuK11uAg9g7kMHiUo2N24eogKzrPLW09X6/EjZI+0YyO36XkgwDlmn+7yJWb'
});
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
    const {to, subject, text, pass} = data;
    console.log(data);
    if (!to || !subject || !text) return new Error('parameter not valid');
    const mailData = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html: `<h1>Su contraseña temporal es: ${pass}</h1>`
    }
    transporter.sendMail(mailData, callback)
};

exports.generateUser = function (email) {
    return new Promise((resolve, reject) => {
        const user = crypto.createHash('md5').update(email).digest('hex');
        const pass = crypto.createHash('md5').update(user).digest('hex');
        const token = jwt.create({email, pass}, process.env.TOKEN_SECRET);
        token.setExpiration(new Date().getTime() + 60 * 1000)
        client.setKey({key: user, value: token.compact()}).then( resp => {
            console.log('SUCCES',resp);
            resolve({user, pass});
        }).catch( err => {
            console.log('err', err);
            reject(err);
        });
    });
}
