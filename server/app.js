// app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const createPdf = require('./create-pdf');
const sendMail = require('./send-mail');
const fs = require('fs');
const tempFileName = 'temp.pdf';

const configUrl = 'https://drive.google.com/uc?export=download&id=' + process.env.CONFIG_FILE_ID;

let config = {};
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

    createPdf(data, res);
    
    // const fileStream = fs.createWriteStream(tempFileName);
    // createPdf(data, fileStream);
    // fileStream.on('finish', () => {
    //     fs.readFile(tempFileName, function(err, fileData) {
    //         if(err) {
    //             res.status(500).send(err);
    //         }
    //         const attachment = new Buffer(fileData, 'binary').toString('base64');
    //         sendMail(config, data, attachment);
    //         fs.unlink(tempFileName, () => {});
    //         res.status(200).send({status: 'OK', content: attachment});
    //     });
    // });
});

app.get('/api/config', function (req, res, next) {
    res.status(200).send(config);

    // req.pipe(request(url)).pipe(res);
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

request(configUrl, function (error, res, body) {
    if (!error && res.statusCode == 200) {
        config = JSON.parse(body);
    }
});


module.exports = app;  