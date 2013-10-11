module.exports = function(app) {
    app.post('/export/csv', function(req, res) {
        // jiraJson is escaped because of it contain single quoute and double quote.
        var jiraJsonString = unescape(req.body.jiraJson);
        console.log(jiraJsonString);
        var jiraJson = JSON.parse(jiraJsonString);        
        res.json(jiraJson);
    });
}
