import * as express from 'express';

import * as task from '../models/task';

const livedata = require('relution/livedata.js');

export function init(app: express.Application) {
    app.use('/api/v1/tasks', livedata.middleware(task.options));
}
