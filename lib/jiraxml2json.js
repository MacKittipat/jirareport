var xml2json = require('xml2json');

module.exports.toJson = function(jiraXml) {
    var resultTasks = new Array();
    var otherTasks = new Array();
    var totalTimeSpentOtherTask = 0;
    var xml2jsonOptions = {
        object: true, // Returns a Javascript object instead of a JSON string.
        sanitize: false // Disable sanitize some character.
    };
    var taskJson = xml2json.toJson(jiraXml, xml2jsonOptions); 
    var items = taskJson.rss.channel.item;    
    for(var i=0; i<items.length; i++) {
        if(items[i].subtasks != 0) { // if item is parent task.
            console.log(items[i].title);
            var resultChilds = new Array();
            // Find subtask.
            var subTasks = items[i].subtasks.subtask;
            if(subTasks.length > 1) { // If length > 1, get subtask as array.
                for (var j=0; j<subTasks.length; j++) {
                    var item = findItem(items, subTasks[j].$t);    
                    // Modify child item.
                    modifyChildItem(item);
                    resultChilds.push(item);
                    console.log(" -" + item.title);
                }   
            } else { // If length = 1, get subtask as object.
                var item = findItem(items, subTasks.$t); 
                // Modify child item.
                modifyChildItem(item);
                resultChilds.push(item);
                console.log(" -" + item.title);
            }
            // Modify parent item.
            modifyParentItem(items[i]);
            // Add parent and child to resultTasks.
            var result = new Object();
            result.parent = items[i];
            result.childs = resultChilds;
            resultTasks.push(result);
        } else if(items[i].parent == null && items[i].subtasks == 0) { // if item is other task.
            var item = items[i];
            if(item.timespent && item.timespent.seconds) {
                totalTimeSpentOtherTask += calculateTimespentHour(item.timespent.seconds);
            }            
            // Modify child item.
            modifyChildItem(item);
            console.log("> " + item.title);
            otherTasks.push(item);
        } 
    }
    // Add other to resultTasks.
    var result = new Object();
    result.parent = new Object();
    result.parent.title = 'other';
    result.parent.timespent = new Object();
    result.parent.timespent.hours = totalTimeSpentOtherTask;
    result.childs = otherTasks;
    resultTasks.push(result);    
    return resultTasks;
}

function modifyParentItem(item) {
    item.timespent = new Object();
    if(item.aggregatetimespent && item.aggregatetimespent.seconds) {
        item.timespent.hours = calculateTimespentHour(item.aggregatetimespent.seconds);
    } else {
        item.timespent.hours = 0.0;
    } 
}

function modifyChildItem(item) {
    if(item.timespent && item.timespent.seconds) {
        item.timespent.hours = calculateTimespentHour(item.timespent.seconds);
    } else {
        item.timespent = new Object();
        item.timespent.hours = 0.0;
    }   
}

function findItem(items, taskId) {
    for(var i=0; i<items.length; i++) {
        if(items[i].link.indexOf(taskId) != -1) { // If link contain taskId.
            return items[i];
        }
    }
}

function calculateTimespentHour(seconds) {
    var second = parseFloat(seconds);
    var hour = second / 3600;
    return hour;
}