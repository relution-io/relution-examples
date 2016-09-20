"use strict";
var task_1 = require('../models/task');
var livedata = require('relution/livedata.js');
function init(app) {
    app.use('/api/v1/tasks', livedata.middleware(task_1.options));
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLHFCQUFzQixnQkFBZ0IsQ0FBQyxDQUFBO0FBRXZDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWpELGNBQXFCLEdBQXdCO0lBQ3pDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRmUsWUFBSSxPQUVuQixDQUFBIn0=