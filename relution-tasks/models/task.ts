import * as _ from 'lodash';
import * as Q from 'q';

const backbone = require('backbone');
const datasync = require('relution/datasync.js');
const security = require('relution/security.js');
const push = require('relution/push.js');

export const options = {
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

export interface Task {
  id: string;
  aclEntries: string[];

  creator: string;
  assignee: string;

  createdAt: Date;
  modifiedAt: Date;
  dueTo: Date;

  title: string;
  description: string;

  state: 'open' | 'done';
}

function setupTask(task: Task) {
  const me = security.getCurrentUser('name');
  task.creator = task.creator || me.name;
  task.assignee = task.assignee || me.name;

  const now = new Date();
  task.createdAt = task.createdAt || now;
  task.modifiedAt = task.modifiedAt || task.createdAt;
  task.dueTo = task.dueTo || new Date(task.createdAt.getTime() + 24 * 60 * 60 * 1000);

  let acl = [
    me.name,
    task.creator,
    task.assignee
  ];
  acl = _.compact(acl);
  acl = _.uniq(acl);
  acl = _.map(acl, (name) => {
    const user = security.getUserByName(name, 'uuid');
    return user.uuid + ':rw';
  });
  task.aclEntries = acl;
}

export function createTask(task: Task, model, options) {
  task.id = task.id || ('task-' + Date.now());
  setupTask(task);

  if (task.state === 'open' && task.assignee !== task.creator) {
    const assignee = security.getUserByName(task.assignee, 'uuid');
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

export function updateTask(task: Task, model, options) {
  setupTask(task);
  return Q(task);
}

export function deleteTask(task: Task, model, options) {
  return Q(task);
}
