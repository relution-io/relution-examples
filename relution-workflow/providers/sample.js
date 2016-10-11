'use strict';
/**
 * providers/sample.js
 * IBX Approval Backend
 *
 * Created by Thomas Beckmann on 02.03.2015
 * Copyright (c)
 * 2015
 * M-Way Solutions GmbH. All rights reserved.
 * http://www.mwaysolutions.com
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
var _ = require('lodash');
var fs = require('fs');
var security = require('relution/security.js');
var push = require('relution/push.js');

// datasync setup
var backbone = require('backbone');
var datasync = require('relution/datasync.js');
var options = {
  entity: 'approvals',
  type: {
    container: 'workflow-app MetaModelContainer',
    model: 'approval'
  },
  idAttribute: 'id',
  sync: datasync.sync
};
var model = options.model = backbone.Model.extend(options);
var collection = options.collection = backbone.Collection.extend(options);

// trigger
var pipeline = require('mcap/pipeline.js');
pipeline.pipelinecall('sampleTrigger', function sampleTrigger(context) {
  return security.runAsSystem(function () {
    return module.exports.trigger(context.mailMessage);
  });
});

// business functions
module.exports = {

  refresh: function refreshSample(user) {
    if (!user) {
      return false;
    }
    // fetch ids only to determine whether any data is present
    var fetch = {
      query: com.mwaysolutions.gofer2.crud.GetQuery.createBuilder().fields(options.idAttribute).build()
    };
    fetch.__proto__ = options;
    var collection = new fetch.collection();
    var error;
    collection.on('error', function onError(model, resp, options) {
      error = resp;
    });
    collection.fetch(fetch);
    if (error) {
      throw error;
    }
    if (collection.length > 0) {
      return;
    }

    // sample load
    return JSON.parse(fs.readFileSync(module.filename + 'on')).forEach(function sample(approval) {
      approval.id = 'sample-' + approval.id + '-' + user.uuid;
      return module.exports.save(approval, user);
    });
  },

  trigger: function triggerSample(mailMessage) {
    var subject = mailMessage.subject;
    var body = mailMessage.content.getBodyPart(0).content;
    var approval = JSON.parse(body);
    var userid = subject.substring(0, subject.indexOf(';'));
    approval.id = 'sample-' + subject.substring(subject.lastIndexOf(';') + 1);

    var user = security.getUserByName(userid, 'uuid', 'name');
    if (user) {
      return module.exports.save(approval, user);
    }
  },

  save: function saveSample(approval, user) {
    var model = new options.model(approval);
    var error;
    model.on('error', function onError(model, resp, options) {
      error = resp;
    });
    model.attributes.provider = 'sample';
    model.attributes.state = 'open';
    var header = {
      typeOfMail: 'approve_or_reject'
    };
    model.attributes.header = _.assign(header, model.attributes.header);
    var approver = {
      id: user.name
    };
    model.attributes.approver = model.attributes.approver || [{}];
    model.attributes.approver[0] = _.assign(approver, model.attributes.approver[0]);
    var requester = {
      id: user.name
    };
    model.attributes.aclEntries = [user.uuid + ':rw'];
    model.attributes.requester = _.assign(requester, model.attributes.requester);
    console.log('saving model: ' + JSON.stringify(model.attributes));
    var xhr = model.save();
    if (error) {
      throw error;
    }
    return xhr;
  },

  destroy: function destroySample(approval) {
    var user = security.getCurrentUser('uuid');
    var model = new options.model(approval);
    var error;
    model.on('error', function onError(model, resp, options) {
      error = resp;
    });
    var xhr = model.destroy();
    if (error) {
      throw error;
    }

    // // silent push informing about deletion
    // var jobs = push.postPushNotification({
    //   extras: {
    //     id: model.id
    //   },
    //   // filter on user's devices only
    //   deviceFilter: {
    //     type: 'string',
    //     fieldName: 'user',
    //     value: user.uuid
    //   }
    // });
    //JSON.stringify(jobs)
    console.info('pushed approval ' + model.id + ' as .');
    return xhr;
  },

  approve: function approveSample(approval, callback) {
    setImmediate(module.exports.destroy.bind(this, approval));
    return callback(undefined, approval);
  },

  reject: function rejectSample(approval, callback) {
    setImmediate(module.exports.destroy.bind(this, approval));
    return callback(undefined, approval);
  }

};
