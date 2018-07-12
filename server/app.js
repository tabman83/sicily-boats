// app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const createPdf = require('./create-pdf');
const sendMail = require('./send-mail');
const fs = require('fs');

// HTTPS only middleware
const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
};
// app.use(forceSSL());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/api/contract', function (req, res, next) {
    const data = req.body;
    console.log(data);
    res.status(200);
    createPdf(data, res);
});

app.get('/api/config', function (req, res, next) {
    const url = 'https://drive.google.com/uc?export=download&id=' + process.env.CONFIG_FILE_ID;
    req.pipe(request(url)).pipe(res);
});
//

/**
 * STATIC FILES
 */
app.use('/', express.static('dist'));

// Default every route except the above to serve the index.html
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'dist/index.html'));
});

module.exports = app;  