var fs = require('fs');
var express = require('express');
var http = require('http');
var https = require('https');
var reload = require('reload')
//var bodyParser = require('body-parser')
//var logger = require('morgan')
const port=80, securePort=8080;

var httpsOptions =
{
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem')
};

var app = express();
//app.set('port', process.env.PORT || securePort)
//app.use(logger('dev'))
//app.use(bodyParser.json())
app.use(express.static(__dirname + '/../Source/'));
app.get('/', (req, res)=> {res.sendFile(__dirname + '/../Source/index.html'); console.log("page sended");} );

var httpServer = http.createServer(app);
var httpsServer = https.createServer(httpsOptions, app);


reload(app).then(function () 
{
    httpServer.listen(port, () => console.log('Start HTTP server and listen on port '+port));
    httpsServer.listen(securePort, () => console.log('Start HTTPS server and listen on port '+securePort));
})
.catch(function (err) 
{
    console.error('Reload could not start, could not start server/sample app', err)
})