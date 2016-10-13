'use strict';
/**
 * @ngdoc controller
 * @name settings:SettingsCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('settings')
  .controller('SettingsCtrl', function SettingsCtrl ($scope, $ionicLoading, $rootScope, Config) {
    this.user = Relution.security.getCurrentUser();
    this.server = Config.ENV.SERVER_URL;

    $scope.$on('$ionicView.enter', function () {
      $ionicLoading.hide();
      $rootScope.$broadcast('show-content');
    });
  });
