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
    app.get('/refresh', function (req, res, next) {
        if (req.method === 'OPTIONS' || req.method === 'HEAD') {
            return res.status(200).end();
        }
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
        if (req.method === 'OPTIONS' || req.method === 'HEAD') {
            return next();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcm92YWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwcm92YWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnQkFBZ0I7QUFDaEIsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTFDLGVBQWU7QUFDZixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsZ0JBQWdCO0FBQ2hCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWpELGNBQXFCLEdBQXdCO0lBQzNDLGtDQUFrQztJQUNsQyw0REFBNEQ7SUFDNUQsZ0VBQWdFO0lBQ2hFLElBQUksV0FBVyxHQUFHLHFCQUFxQixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUc7UUFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUM7SUFFRixHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDN0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLHNFQUFzRTtRQUN2RixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLEVBQUUsQ0FBQyxDQUFDLDJCQUEyQjtRQUNyQyxDQUFDO0lBQ0gsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQywrQkFBK0I7SUFDckUs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