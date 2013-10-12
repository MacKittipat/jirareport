// Import 
var mainRoute = require('./routes/main');
var exportRoute = require('./routes/export');
var express = require('express');
var jiraXml2Json = require('./lib/jiraxml2json');
var jiraJson2Csv = require('./lib/jirajson2csv');

// Global var
var app = express();

// Use ejs template engine
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
// Import all assets file
app.use(express.static(__dirname + '/assets'));
// Enable req.body.PARAMETER
app.use(express.bodyParser()); 

// Route
mainRoute(app, jiraXml2Json);
exportRoute(app, jiraJson2Csv);

app.listen(9000);
console.log("App is running at http://localhost:9000");