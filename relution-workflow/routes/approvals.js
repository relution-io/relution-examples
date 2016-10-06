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
    app.put('/approvals/:id', errorStatus.bind(undefined, 405)); // no update
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcm92YWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwcm92YWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnQkFBZ0I7QUFDaEIsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTFDLGVBQWU7QUFDZixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsZ0JBQWdCO0FBQ2hCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWpELGNBQXFCLEdBQXdCO0lBQzdDLGtDQUFrQztJQUNoQyw0REFBNEQ7SUFDNUQsZ0VBQWdFO0lBQ2hFLElBQUksV0FBVyxHQUFHLHFCQUFxQixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUc7UUFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUM7SUFDRixHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQ3pFLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUM3RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsc0VBQXNFO1FBQ3ZGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksRUFBRSxDQUFDLENBQUMsMkJB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