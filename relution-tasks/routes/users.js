"use strict";
var security = require('relution/security.js');
function init(app) {
    app.get('/api/v1/users/me', function getUser(req, res, next) {
        res.json(security.getCurrentUser());
    });
    app.get('/api/v1/users/:name', function getUser(req, res, next) {
        res.json(security.getUserByName(req.param['name']));
    });
    app.get('/api/v1/users', function getUsers(req, res, next) {
        res.json(security.getUsersByExample(req.query, 'uuid', 'name'));
    });
}
exports.init = init;
//# sourceMappingURL=users.js.map