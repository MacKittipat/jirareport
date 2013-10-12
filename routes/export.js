module.exports = function(app, jiraJson2Csv) {
    app.post('/export/csv', function(req, res) {
        // jiraJson is escaped because of it contain single quoute and double quote.
        var jiraJsonString = unescape(req.body.jiraJson);
        console.log("[DEBUG : export.js] jiraJsonString = " + jiraJsonString);
        var jiraJson = JSON.parse(jiraJsonString);     
        res.setHeader('Content-Type', 'text/plain');
        res.end(jiraJson2Csv.toCsv(jiraJson));
    });
}
