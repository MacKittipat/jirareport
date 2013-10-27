// Import routes
var mainRoute = require('./routes/main');
var exportRoute = require('./routes/export');
// Import libs
var express = require('express');
var jiraXml2Json = require('./lib/jiraxml2json');
var jiraJson2Csv = require('./lib/jirajson2csv');
var exec = require('child_process').exec;
var fs = require('fs');
var config = require('./config');

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
mainRoute(app, jiraXml2Json, config);
exportRoute(app, jiraJson2Csv, exec, fs);

app.listen(config.appPort);
console.log("App is running at http://localhost:" + config.appPort);