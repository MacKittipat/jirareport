module.exports = function(app, jiraXml2Json, config) {
    app.get('/', function(req, res) {
        res.render('main_index', {
            'jiraXmlUrl':config.jiraXmlUrl
        });
    });

    app.post('/builder', function(req, res) {
        var jiraXml = req.body.xmlText;
        var jiraJson = jiraXml2Json.toJson(jiraXml);
        res.render('main_builder', {
            'jiraJsonString':JSON.stringify(jiraJson)
        });
    });
}
