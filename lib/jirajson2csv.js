module.exports.toCsv = function(jiraJson) {
    var jiraCsv = "Task, Time Spent (hr)\n";
    for(var i=0; i<jiraJson.parents.length; i++) {
        var parent = jiraJson.parents[i];
        jiraCsv += parent.title + ", " + parent.timespent.hour + "\n";
        for(var j=0; j<parent.childs.length; j++) {
            var child = parent.childs[j];
            jiraCsv += child.title + ", " + child.timespent.hour + "\n";
        }
    }
    jiraCsv += "Total Time Spent, " + jiraJson.timespent.hour + "\n";
    return jiraCsv;
}