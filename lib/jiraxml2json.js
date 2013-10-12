var xml2json = require('xml2json');

module.exports.toJson = function(jiraXml) {
    var xml2jsonOptions = {
        object: true, // Returns a Javascript object instead of a JSON string.
        sanitize: false // Disable sanitize some character.
    };
    var jiraJson = xml2json.toJson(jiraXml, xml2jsonOptions);
    var items = jiraJson.rss.channel.item;    
    
    var parentTasks = new Array();
    // Find parent task.
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // Item is parent task.
        if (item.subtasks != 0) { 
            // Create parent task obj.
            var parentTask = new Object();
            assignItemAttributeToTask(parentTask, item, 'parent');
            // Find sub task.
            parentTask.childs = findSubTask(items, item.key.$t);
            parentTasks.push(parentTask);
        }
    }
    
    // Find other task.
    var parentOfOtherTask = new Object();
    parentOfOtherTask.title = 'Other';
    parentOfOtherTask.tasktype = 'parent';
    var otherTasksTimeSpentHour = 0;
    var otherTasks = findOtherTasks(items);
    for(var i = 0; i < otherTasks.length; i++) {
        var otherTask = otherTasks[i];
        otherTasksTimeSpentHour += otherTask.timespent.hour;
    }
    parentOfOtherTask.timespent = new Object();
    parentOfOtherTask.timespent.hour = otherTasksTimeSpentHour;
    parentOfOtherTask.childs = otherTasks;     
    parentTasks.push(parentOfOtherTask);
    
    // Create result.
    var result = new Object();
    result.parents = parentTasks;
    // Find total timespent of all task.
    result.timespent = new Object();
    var totalTimeSpentHour = 0;
    for(var i = 0; i < parentTasks.length; i++) {
        var parentTask = parentTasks[i];
        totalTimeSpentHour += parentTask.timespent.hour;
    }
    result.timespent.hour = totalTimeSpentHour;
      
    console.log("[DEBUG : jiraxml2json.js] result = " + result);
    return result;
}

/**
 * Assign item's attribute to taks object.
 * @param {Object} task 
 * @param {Object} item
 * @param {String} taskType
 */
function assignItemAttributeToTask(task, item, taskType) {
    task.title = item.title;
    task.tasktype = taskType;
    task.keyname = item.key.$t;
    task.timespent = new Object();
    if(taskType == 'parent') { // Parent.
        if (item.aggregatetimespent && item.aggregatetimespent.seconds) {
            task.timespent.hour = calculateTimespentHour(item.aggregatetimespent.seconds);
        } else {
            task.timespent.hour = 0.0;
        }            
    } else { // Child.
        if (item.timespent && item.timespent.seconds) {
            task.timespent.hour = calculateTimespentHour(item.timespent.seconds);
        } else {
            task.timespent.hour = 0.0;
        }
    }
}

/**
 * Find sub task.
 * @param {Array} items
 * @param {String} parentKeyName, for example BT-1111
 * @return {Array} Array of subtask
 */
function findSubTask(items, parentKeyName) {
    var subTasks = new Array();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];        
        // If item is sub task and parent name id is parentNameId.
        if (item.parent && item.parent.$t == parentKeyName) {           
            // Create sub task obj.
            var subTask = new Object();
            assignItemAttributeToTask(subTask, item, 'child');
            subTasks.push(subTask);
        }
    }
    return subTasks;
}

/**
 * Find other task. 
 * @param {Array} items
 * @return {Array} Array of other task
 */
function findOtherTasks(items) {
    var otherTasks = new Array();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.parent == null && item.subtasks == 0) { // If item is other task.
            var otherTask = new Object();
            assignItemAttributeToTask(otherTask, item, 'child');
            otherTasks.push(otherTask);
        }
    }
    return otherTasks;
}

/**
 * Calculate timespent seconds to hour
 * @param {Integer} seconds
 * @return {Float} hour
 */
function calculateTimespentHour(seconds) {
    var second = parseFloat(seconds);
    var hour = second / 3600;
    return hour;
}