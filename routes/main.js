module.exports = function(app, jiraxml2json) {
    app.get('/', function(req, res) {
        res.render('main_index');
    });

    app.post('/builder', function(req, res) {
        var jiraXml = req.body.xmlContent;
        res.render('main_builder', {
            'data':jiraxml2json.toJson(jiraXml)
        });
    });
}
