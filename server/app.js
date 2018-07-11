// app.js
const express = require('express');  
const app = express();  
const path = require('path');  
const bodyParser = require('body-parser');

// HTTPS only middleware
const forceSSL = function() { 
    return function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
};
app.use(forceSSL());

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * API
 */
app.get('/api', function(req, res, next) {  
    let data = {
        message: 'Hello World!'
    };
    res.status(200).send(data);
});
app.post('/api', function(req, res, next) {  
    let data = req.body;
    // query a database and save data
    res.status(200).send(data);
});
app.post('/api/contract', function(req, res, next) {  
    let data = req.body;
    console.log(data);
    // query a database and save data
    res.status(200).send(data);
});

/**
 * STATIC FILES
 */
app.use('/', express.static('dist'));

// Default every route except the above to serve the index.html
app.get('*', function(req, res) {  
    res.sendFile(path.join(__dirname, '..', 'dist/index.html'));
});

module.exports = app;  