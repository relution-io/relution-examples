'use strict';
/**
 * @ngdoc controller
 * @name approval:ApprovalListCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('approval')
  .controller('ApprovalListCtrl', function ApprovalListCtrl ($scope, $q, $filter, $timeout, $state, $ionicScrollDelegate, $ionicLoading, $window, MomentService, $rootScope, ApprovalsService) {
    /**
     * @ngdoc property
     * @name self
     * @propertyOf approval:ApprovalListCtrl
     */
    var self = this;
    this.state = {
      inProgress: false
    };
    this.available = true;
    this.overflowScroll = ionic.Platform.isAndroid();
    this.noMoreItemsAvailable = false;
    this.moreOptions = {};
    this.service = ApprovalsService;
    $scope.filter = {
      value: ''
    };
    /**
     * @ngdoc property
     * @name search
     * @description is in serach mode or not
     * @propertyOf approval:ApprovalListCtrl
     */
    this.search = false;
    /**
     * @ngdoc property
     * @name approvals
     * @description the approvals
     * @propertyOf approval:ApprovalListCtrl
     */
    this.approvals = [];
    /**
     * @ngdoc property
     * @name noResult
     * @description is needed for ui
     * @propertyOf approval:ApprovalListCtrl
     */
    this.noResult = false;
    /**
     * @ngdoc property
     * @name noResult
     * @description is needed for ui
     * @propertyOf approval:ApprovalListCtrl
     */
    var filterCount = 0;
    $scope.filterBy = function (item) {
      if ($scope.filter.value.length <= 2) {
        return true;
      }
      var regex = new RegExp($scope.filter.value, 'gi');
      if (regex.exec(item.attributes.header.objectId) || regex.exec(item.attributes.requester.name)) {
        filterCount++;
        self.noResult = false;
        return true;
      }
      filterCount++;
      if (filterCount === self.approvals.rows.length) {
        filterCount = 0;
        self.scrollTop();
        self.noResult = true;
      }
      return false;

    };
    /**
     * @ngdoc method
     * @name sync
     * @methodOf approval:ApprovalListCtrl
     */
    this.sync = function () {
      self.state.inProgress = true;
      $scope.$broadcast('scroll.refreshComplete');
      ApprovalsService.init = true;
      self.noMoreItemsAvailable = false;
      var queue = [ApprovalsService.resetCollection()];
      $ionicLoading.show();
      $q.all(queue)
        .then(function () {
          return self.setData();
        })
        .catch(function () {
          ApprovalsService.init = false;
          self.state.inProgress = false;
        })
        .finally($ionicLoading.hide);
    };
    /**
     * @ngdoc method
     * @name scrollTop
     * @methodOf approval:ApprovalListCtrl
     */
    this.scrollTop = function () {
      $ionicScrollDelegate.$getByHandle('approval-list').scrollTop();
    };
    /**
     * @ngdoc method
     * @name switchToInput
     * @methodOf approval:ApprovalListCtrl
     */
    this.switchToInput = function () {
      if (self.search) {
        $scope.filter.value = '';
      }
      self.search = !self.search;
      if (self.search) {
        $timeout(function () {
          document.querySelector('.search-input').focus();
        }, 150);
      }
    };

    this.goEdit = function (id, state) {
      return $state.go('mway.approval.edit', { id: id, state: state });
    };

    this.setData = function () {
      return $q.resolve(ApprovalsService.fetchCollection())
        .then(function () {
          self.state.inProgress = false;
          self.approvals.rows = ApprovalsService.entries.models;
          // self.approvals.rows.forEach(function(model) {
          //   console.log(model.attributes.header.objectType);
          // });
          ApprovalsService.init = false;
        })
        .catch(function (e) {
          self.state.inProgress = false;
          console.error(e);
        });
    };
    /**
     * @ngdoc method
     * @name promise
     * @methodOf approval:ApprovalListCtrl
     * @description fetch the collection
     */
    $scope.$on('$ionicView.beforeEnter', function () {
      self.state.inProgress = true;
    });

    $scope.$on('$ionicView.enter', function () {
      MomentService.getLanguagePrefix();
      return self.setData();
    });

    $rootScope.$on('$translateChangeSuccess', function () {
      $rootScope.$broadcast('amMoment:localeChanged');
    });
    this.getMore = function () {
      if (ApprovalsService.entries && ApprovalsService.entries.models.length > 0) {
        return ApprovalsService.entries.fetchMore(self.moreOptions).then(function () {
          self.noMoreItemsAvailable = self.moreOptions.end;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      } else {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    };
  })
  .directive('delayedModel', function () {
    return {
      scope: {
        model: '=delayedModel'
      },
      link: function (scope, element, attrs) {

        element.val(scope.model);

        scope.$watch('model', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            element.val(scope.model);
          }
        });

        var timeout;
        element.on('keyup paste search', function () {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            scope.model = element[0].value;
            element.val(scope.model);
            scope.$apply();
          }, attrs.delay || 500);
        });
      }
    };
  });
