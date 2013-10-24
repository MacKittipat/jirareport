var exec = require('child_process').exec;

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
            var htmlContent = html.replace(new RegExp("\n", "g"), "");
            htmlContent = htmlContent.replace(new RegExp("\'", "g"), "\\'");
            htmlContent = htmlContent.replace(new RegExp("\"", "g"), '\\"');
            var child = exec('java -jar exe/html2pdf-1.0.jar "' + htmlContent +  '" "/home/mac/test.pdf"',
            function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        });
    }); 
}
