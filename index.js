require('dotenv').config({
    path: 'environment/.env'
})

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const transporter = require('./transporter');
const dayjs = require('dayjs');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

const route = express.Router();
const port = process?.env?.PORT || 80;

app.use('/v1', route);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

route.post('/send-email', (req, res) => {
    transporter.generateUser(req.body.to).then( ({user, pass}) => {

        res.cookie('user', user, {
            expires: dayjs().add(20, 'minutes').toDate(),
            httpOnly: true,
            domain: '.compute-1.amazonaws.com'
        });

        transporter.send({
            to: req.body.to,
            subject: 'Access password',
            text: pass,
            pass,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: 'Email not sent'
                });
            }
            res.status(200).send({
                user,
                message: 'Email sent correctly',
                message_id: info.messageId
            });
        });
    }).catch( err => {
        console.log(err);
        return res.status(500).send({
            error: 'Email not sent'
        });
    });
});

route.post('/verify-opt', (req, res) => {
    console.log(req.cookies);
    console.log(req.headers);
    res.status(200).send({
        echo: JSON.stringify(req.cookies)
    })
})
