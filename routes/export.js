var exec = require('child_process').exec;
var fs = require('fs');

module.exports = function(app, jiraJson2Csv) {
    app.post('/export/csv', function(req, res) {
        // jiraJson is escaped because of it contain single quoute and double quote.
        var jiraJsonString = unescape(req.body.jiraJson);
        console.log("[DEBUG : export.js] jiraJsonString = " + jiraJsonString);
        var jiraJson = JSON.parse(jiraJsonString);     
        res.setHeader('Content-Type', 'text/plain');
        res.end(jiraJson2Csv.toCsv(jiraJson));
    });
    
    app.post('/export/pdf', function(req, res){
        var jiraJsonString = unescape(req.body.jiraJson);
        var jiraJson = JSON.parse(jiraJsonString);
        res.render('export_pdf', {
            'jiraJson':jiraJson,
        }, function(err, html) {
            var htmlContent = html.replace(new RegExp("\n", "g"), ""); // Remove newline
            htmlContent = htmlContent.replace(new RegExp("\'", "g"), "\\'"); // Escape single quote
            htmlContent = htmlContent.replace(new RegExp("\"", "g"), '\\"'); // Escape double quote
            // If target dir does not exist, create a new one
            fs.exists('target', function(exists) {
                if(!exists) {
                    fs.mkdirSync('target');
                }
            });
            // Use html2pdf to generate PDF : https://github.com/MacKittipat/html2pdf
            var child = exec('java -jar exe/html2pdf-1.0.jar "' + htmlContent +  '" "target/test.pdf"',
            function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                } else {
                    // Render PDF on browser
                    var pdfPath = 'target/test.pdf';
                    var pdfStat = fs.statSync(pdfPath);
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Length': pdfStat.size
                    });
                    var readStream = fs.createReadStream(pdfPath);
                    readStream.pipe(res);                    
                }
            });
        });
    }); 
}
