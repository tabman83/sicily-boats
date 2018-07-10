// server.js
const app = require('./server/app');  
const port = 5050;

app.listen(port, function() {  
    console.log('Express server listening on port ' + port);
});