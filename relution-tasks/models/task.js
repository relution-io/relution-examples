"use strict";
var _ = require('lodash');
var Q = require('q');
var backbone = require('backbone');
var datasync = require('relution/datasync.js');
var security = require('relution/security.js');
var push = require('relution/push.js');
exports.options = {
    entity: 'Task',
    type: {
        container: 'relution-tasks MetaModelContainer',
        model: 'Task'
    },
    idAttribute: 'id',
    aclAttribute: 'aclEntries',
    backbone: backbone,
    sync: datasync.sync,
    backend: new datasync.Backend({
        create: createTask,
        update: updateTask,
        delete: deleteTask
    })
};
function setupTask(task) {
    var me = security.getCurrentUser('name');
    task.creator = task.creator || me.name;
    task.assignee = task.assignee || me.name;
    var now = new Date();
    task.createdAt = task.createdAt || now;
    task.modifiedAt = task.modifiedAt || task.createdAt;
    task.dueTo = task.dueTo || new Date(task.createdAt.getTime() + 24 * 60 * 60 * 1000);
    var acl = [
        me.name,
        task.creator,
        task.assignee
    ];
    acl = _.compact(acl);
    acl = _.uniq(acl);
    acl = _.map(acl, function (name) {
        var user = security.getUserByName(name, 'uuid');
        return user.uuid + ':rw';
    });
    task.aclEntries = acl;
}
function createTask(task, model, options) {
    setupTask(task);
    if (task.state === 'open' && task.assignee !== task.creator) {
        var assignee = security.getUserByName(task.assignee, 'uuid');
        push.postPushNotification({
            description: 'A new task is assigned to you: ' + task.title,
            badge: '+1',
            extras: {
                i18n: 'TASK_NEW',
                id: task.id
            },
            deviceFilter: push.pushDeviceFilterByUsers(assignee)
        });
    }
    return Q(task);
}
exports.createTask = createTask;
function updateTask(task, model, options) {
    setupTask(task);
    return Q(task);
}
exports.updateTask = updateTask;
function deleteTask(task, model, options) {
    return Q(task);
}
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.js.map