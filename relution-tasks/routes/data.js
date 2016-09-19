"use strict";
var task = require('../models/task');
var livedata = require('relution/livedata.js');
function init(app) {
    app.use('/api/v1/tasks', livedata.middleware(task.options));
}
exports.init = init;
//# sourceMappingURL=data.js.map