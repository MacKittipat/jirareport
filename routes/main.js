module.exports = function(app, jiraXml2Json) {
    app.get('/', function(req, res) {
        res.render('main_index', {
            'jiraXmlUrl':'https://apidev.atlassian.net/sr/jira.issueviews:searchrequest-xml/temp/SearchRequest.xml?jqlQuery=Sprint = ${sprintNumber} ORDER BY created asc&tempMax=1000'
        });
    });

    app.post('/builder', function(req, res) {
        var jiraXml = req.body.xmlText;
        var jiraJson = jiraXml2Json.toJson(jiraXml);
        res.render('main_builder', {
            'jiraJson':jiraJson,
            'jiraJsonString':JSON.stringify(jiraJson)
        });
    });
}
