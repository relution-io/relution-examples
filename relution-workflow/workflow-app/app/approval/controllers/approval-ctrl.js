'use strict';
/**
 * @ngdoc controller
 * @name approval:ApprovalCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('approval')
  .controller('ApprovalCtrl', function ApprovalCtrl ($q, $state, Config, ApprovalsService) {
    this.sideBarLinks = Config.SIDEBAR_LINKS;
    this.logout = function () {
      $q.resolve(Relution.web.logout())
        .finally(function () {
          ApprovalsService.resetCollection();
          return $state.go('mway.login');
        });
    };
  });
