'use strict';
/**
 * @ngdoc service
 * @name approval:ApprovalsService
 * @description add your description
 */
angular.module('approval')
  .service('ApprovalsService', function ApprovalsService ($q, $rootScope, $window, $filter, Config, ServerUrlService, AlertService) {
    var self = this;
    this.pendings = [];
    this.init = true;
    this.counter = 10;
    this.entriesOptions = {
      limit: ionic.Platform.isIPad() ? 50 : 10,
      sortOrder: [ '-approver[0].receivedDate', '-id' ]
    };
    /**
     * @ngdoc property
     * @name channel
     * @description socket channel
     * @propertyOf approval:ApprovalsService
     */
    this.channel = null;

    /**
     * @ngdoc property
     * @name model
     * @propertyOf approval:ApprovalsService
     */
    this.model = Relution.livedata.Model.extend({
      idAttribute: 'id',
      entity: 'approvals',
      urlRoot: Config.COLLECTIONS_URLS.APPROVALS
    });
    /**
     * @ngdoc property
     * @name collection
     * @propertyOf approval:ApprovalsService
     */
    this.collection = null;
    /**
     * @ngdoc property
     * @name entries
     * @propertyOf approval:ApprovalsService
     */
    this.entries = null;
    /**
     * @ngdoc method
     * @name getEntryByState
     * @methodOf approval:ApprovalsService
     */
    this.getEntryByState = function (state) {
      return self.entries.select({
        query: {
          $or: [
            {state: state}
          ]
        }
      });
    };
    /**
     * @ngdoc method
     * @name addPending
     * @description we cant set a own attribute to the model so we store the pendingsid here. The put call is very slow so we have to manage the call in the background
     * @methodOf approval:ApprovalsService
     */
    this.addPending = function (id) {
      self.pendings.unshift(id);
    };
    /**
     * @ngdoc method
     * @name addPending
     * @description is a pending or not
     * @methodOf approval:ApprovalsService
     */
    this.isPending = function (id) {
      if (self.pendings.indexOf(id) === -1) {
        return false;
      }
      return true;
    };
    /**
     * @ngdoc method
     * @name removePending
     * @description slice the array by id
     * @methodOf approval:ApprovalsService
     */
    this.removePending = function (id) {
      var index = self.pendings.indexOf(id);
      if (index !== -1) {
        self.pendings.slice(index, 1);
      }
    };
    this.applyAsync = function () {
      $rootScope.$applyAsync();
    };
    this.setEntries = function () {
      self.entries = self.store.createCollection(self.collection);
      /**
       * @ngdoc event
       * @name remove
       * @eventOf approval:ApprovalsService
       * @eventType emit
       */
      this.entries.on('remove add set sync change', self.applyAsync);

    };
    /**
     * @ngdoc method
     * @name query
     * @methodOf approval:ApprovalsService
     */
    this.query = function (query) {
      return self.entries.select(query);
    };

    /**
     * @ngdoc method
     * @name handleError
     * @methodOf approval:ApprovalsService
     */
    this.handleError = function (model, error) {
      // eventually an xhr response was incorrectly passed instead of an error
      if (error && !error.message && error.responseJSON && error.responseJSON.error) {
        error = error.responseJSON.error;
      }

      // extract viable information, model and/or error may be undefined/null
      var objectId = model && model.attributes && model.attributes.header && model.attributes.header.objectId;
      var message = error && error.message;
      if (typeof message === 'string') {
        // strip off potential server-side JavaScript stack trace
        var strip = message.lastIndexOf('-- ');
        if (strip >= 0) {
          message = message.substring(0, strip);
        }
        // replace new-lines with HTML line breaks
        var index = -1;
        while (index < message.length && (index = message.indexOf('\n', index + 1)) > 0) {
          message = message.substring(0, index) + '<br />' + message.substring(index + 1);
        }
      }

      // show an error popup
      AlertService.map({
        cssClass: 'assertive',
        title: objectId || $filter('translate')('ERROR_ON_PATCH_APPROVAL_TITLE'),
        message: message || $filter('translate')('ERROR_ON_PATCH_APPROVAL'),
        buttons: [
          {
            text: $filter('translate')('CLOSE'),
            type: 'button-positive'
          }
        ]
      });
    };

    /**
     * @ngdoc method
     * @name resetCollection
     * @methodOf approval:ApprovalsService
     */
    this.resetCollection = function () {
      self.entries.off('remove add set sync change', self.applyAsync);
      self.entries.stopListening();
      self.store = null;
      self.collection = null;
      self.entries = null;
      self.init = true;
    };

    /**
     * @ngdoc method
     * @name fetchCollection
     * @methodOf approval:ApprovalsService
     */
    this.fetchCollection = function (explicit) {
      if (!self.collection) {
        self.store = new Relution.livedata.SyncStore({
          useLocalStore: true,
          useSocketNotify: true,
          useOfflineChanges: true,
          error: self.handleError.bind(self)
        });
        self.collection = Relution.livedata.Collection.extend({
          model: self.model,
          entity: 'approvals'
        });
      }
      if (!self.entries) {
        self.setEntries();
      }
      if (self.init || explicit) {
        return self.entries.fetch(self.entriesOptions).then(function (res) {
          return res;
        })
        .catch(function (e) {
          console.error(e);
        });
      }
    };
  });
