// Import 
var mainRoute = require('./routes/main');
var express = require('express');
var jiraxml2json = require('./lib/jiraxml2json');

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
mainRoute(app, jiraxml2json);


app.listen(9000);
console.log("App is running at http://localhost:9000");