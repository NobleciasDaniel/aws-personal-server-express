require('dotenv').config({
    path: 'environment/.env'
})
const express = require('express');
const bodyParser = require('body-parser');
const transporter = require('./transporter');

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

const route = express.Router();
const port = process?.env?.PORT || 80;

app.use('/v1', route);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

route.post('/send-email', (req, res) => {
    transporter.send({
        to: req.body.to,
        subject: 'Access password',
        text: 'Temporal'
    }, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: 'Email not sent'
            });
        }
        res.status(200).send({
            message: 'Email sent correctly',
            message_id: info.messageId
        });
    });
});
