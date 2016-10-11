"use strict";
// approval APIs
var providers = require('../providers');
// node.js APIs
var util = require('util');
// relution APIs
var security = require('relution/security.js');
var livedata = require('relution/livedata.js');
var datasync = require('relution/datasync.js');
function init(app) {
    // filtering of CRUDs not allowed,
    // infrastructure permits arbitrary update/patch operations,
    // for our use case we allow patching the state and comment only
    var errorStatus = function errorStatus(status, req, res) {
        res.send(status);
    };
    // app.put('/approvals/:id', errorStatus.bind(undefined, 405)); // no update
    app.patch('/approvals/:id', function filterPatch(req, res, next) {
        if (req.body.state && req.body.comment) {
            next('route'); // acceptable patch request targeting the state and comment field only
        }
        else {
            next(); // disallowed patch request
        }
    }, errorStatus.bind(undefined, 400)); // patch for state updates only
    // following is the case already as our backend does not implement create/delete:
    //app.post('/approvals', errorStatus.bind(undefined, 405)); // no creation
    //app.delete('/approvals/:id', errorStatus.bind(undefined, 405)); // no deletion
    //app.delete('/approvals', errorStatus.bind(undefined, 405)); // no purge
    app.get('/refresh', function (req, res) {
        var user = security.getCurrentUser('uuid', 'name', 'organizationUuid');
        if (user) {
            res.status(200).json(providers['sample'].refresh(user));
        }
        else {
            res.status(404);
        }
    });
    // error constructor used for CRUD interface
    function HttpError(status) {
        Error.call(this, Array.prototype.slice.call(arguments, 1));
        this.status = status;
    }
    ;
    util.inherits(HttpError, Error);
    // hook-in refresh mechanism executed on client connect
    app.use('/approvals/info', function refreshApproval(req, res, next) {
        var user = security.getCurrentUser('uuid', 'name', 'organizationUuid');
        if (user) {
            for (var provider in providers) {
                var impl = providers[provider];
                if (impl.refresh) {
                    impl.refresh(user);
                }
            }
        }
        return next();
    });
    // approvals CRUD interface
    var options = {
        entity: 'approvals',
        type: {
            container: 'workflow-app MetaModelContainer',
            model: 'approval'
        },
        idAttribute: 'id',
        backend: new datasync.Backend({
            // incoming patch request is translated to an update by infrastructure,
            // process update to access additional data of the approval, such as provider field
            update: function updateApproval(approval, callback) {
                // select provider
                var provider = providers[approval.provider];
                if (!provider) {
                    return callback(new HttpError(400));
                }
                // apply approve/reject function of provider
                switch (approval.state) {
                    case 'approved':
                        return provider.approve.apply(this, arguments);
                    case 'rejected':
                        return provider.reject.apply(this, arguments);
                    default:
                        return callback(new HttpError(400));
                }
            }
        })
    };
    app.use('/approvals', livedata.middleware(options));
    return options;
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcm92YWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwcm92YWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnQkFBZ0I7QUFDaEIsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTFDLGVBQWU7QUFDZixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsZ0JBQWdCO0FBQ2hCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWpELGNBQXFCLEdBQXdCO0lBQzNDLGtDQUFrQztJQUNsQyw0REFBNEQ7SUFDNUQsZ0VBQWdFO0lBQ2hFLElBQUksV0FBVyxHQUFHLHFCQUFxQixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUc7UUFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUM7SUFDRiw0RUFBNEU7SUFDNUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzdELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxzRUFBc0U7UUFDdkYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxFQUFFLENBQUMsQ0FBQywyQkFBMkI7UUFDckMsQ0FBQztJQUNILENBQUMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMs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