'use strict';
/**
 * @ngdoc directive
 * @restrict E
 * @requires
 * @name main:hourGlassLoader
 */
angular.module('main')
.directive('hourGlassLoader', function () {
  return {
    templateUrl: 'main/temoplates/directives/hourglass.html',
    restrict: 'E'
  };
});
