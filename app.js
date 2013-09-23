// Import 
var mainRoute = require('./routes/main');
var express = require('express');

// Global var
var app = express();

// Config View
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.bodyParser()); // Enable req.body.PARAMETER.

// Route
mainRoute(app);


app.listen(9000);
console.log("App is running at http://localhost:9000");