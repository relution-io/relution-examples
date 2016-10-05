/**
 * @file routes/connectors.js
 * relutionSampleApproval Backend
 */
"use strict";
// Relution APIs
var connector = require('relution/connector.js');
/**
 * module providing direct access to connectors.
 *
 * Used by Relution SDK connectors module for direct access to backend servers. If you do not want
 * or need this functionality, the routes defined herein can be removed.
 *
 * @param app express.js application to hook into.
 */
function init(app) {
    app.post('/api/v1/connectors/:connection', 
    /**
     * installs session data such as credentials.
     *
     * @param req containing body JSON to pass as input.
     * @param res result of call is provided as JSON body data.
     * @param next function to invoke error handling.
     */
    function serviceCall(req, res, next) {
        connector.configureSession(req.params.connection, req.body);
        res.send(204); // success --> 204 no content
    });
    app.post('/api/v1/connectors/:connection/:call', 
    /**
     * calls directly into a service connection.
     *
     * @param req containing body JSON to pass as input.
     * @param res result of call is provided as JSON body data.
     * @param next function to invoke error handling.
     */
    function serviceCall(req, res, next) {
        connector.runCall(req.params.connection, req.params.call, req.body).then(res.json.bind(res), next).done();
    });
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbm5lY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILGdCQUFnQjtBQUNoQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNuRDs7Ozs7OztHQU9HO0FBQ0gsY0FBcUIsR0FBUTtJQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLGdDQUFnQztJQUN2Qzs7Ozs7O09BTUc7SUFDSCxxQkFBcUIsR0FBUSxFQUFFLEdBQVEsRUFBRSxJQUFTO1FBQ2hELFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtJQUM5QyxDQUFDLENBQ0YsQ0FBQztJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0NBQXNDO0lBQzdDOzs7Ozs7T0FNRztJQUNILHFCQUFxQixHQUFRLEVBQUUsR0FBUSxFQUFFLElBQVM7UUFDaEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVHLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQTNCZSxZQUFJLE9BMkJuQixDQUFBIn0=