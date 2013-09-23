module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('main_index');
    });
    
    app.post('/builder', function(req, res) {
        console.log("=============== XML Content ===============");
        console.log(req.body.xmlContent);
        console.log("===========================================");
        res.render('main_builder');
    });
}