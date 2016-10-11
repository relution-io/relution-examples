import * as express from 'express';
// approval APIs
const providers = require('../providers');

// node.js APIs
const util = require('util');

// relution APIs
const security = require('relution/security.js');
const livedata = require('relution/livedata.js');
const datasync = require('relution/datasync.js');

export function init(app: express.Application) {
  // filtering of CRUDs not allowed,
  // infrastructure permits arbitrary update/patch operations,
  // for our use case we allow patching the state and comment only
  var errorStatus = function errorStatus(status, req, res) {
    res.send(status);
  };

  app.patch('/approvals/:id', function filterPatch(req, res, next) {
    if (req.body.state && req.body.comment) {
      next('route'); // acceptable patch request targeting the state and comment field only
    } else {
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
    } else {
      res.status(404);
    }
  });

  // error constructor used for CRUD interface
  function HttpError(status) {
    Error.call(this, Array.prototype.slice.call(arguments, 1));
    this.status = status;
  };
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
      // read is supplied by infrastructure to fetch data from live store only
    })
  };
  app.use('/approvals', livedata.middleware(options));
  return options;
}
