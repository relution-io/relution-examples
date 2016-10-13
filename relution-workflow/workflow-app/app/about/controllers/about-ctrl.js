'use strict';
/**
 * @ngdoc controller
 * @name about:StartCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('about')
  .controller('AboutCtrl', function AboutCtrl ($scope, $window, $rootScope, $ionicLoading, Config) {
    var self = this;
    this.bowerPackages = Config.BOWER_DEPENDENCIES;
    this.browser = function (url) {
      $window.webview.openWebView(
        function () {

        },
        function () {

        },
        {
          iconColor: '#5394CA',
          backgroundColor: '#ffffff',
          isPDF: false,
          url: url,
          visibleAddress: false,
          editableAddress: false,
          icons: {
            backward: true,
            forward: true,
            refresh: true
          }
        });
    };
    $scope.$on('$ionicView.enter', function () {
      $ionicLoading.hide();
      $rootScope.$broadcast('show-content');
      if ($window.cordova) {
        self.appVersion = $window.device.appVersionName;
      } else {
        self.appVersion = '0.0.1-browser';
      }
    });
  });
