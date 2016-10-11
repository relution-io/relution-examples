/**
 * Created by Pascal Brewing
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
'use strict';
/**
 * @ngdoc controller
 * @name auth:LoginCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('auth')
  .controller('LoginCtrl', function LoginCtrl ($scope, $rootScope, $state, $filter, AlertService, Config) {
    var self = this;
    this.state = {
      loginIsInProgress: false
    };
    /**
     * @ngdoc property
     * @name loader
     * @description the smal loader on the right on login
     * @propertyOf auth:LoginCtrl
     */
    this.loader = {
      //loadingIcon: ionic.Platform.isAndroid() ? 'android' : 'ios',
      cssClass: 'balanced',
      loadingIcon: 'ripple',
      onLoad: false,
      toggle: function () {
        self.loader.onLoad = !self.loader.onLoad;
      }
    };
    this.credentials = {
      userName: Config.USERS[0].name,
      password: Config.USERS[0].password
    };

    this.form = {
      $submitted: false
    };
    /**
     * @ngdoc property
     * @name service
     * @description the relution-client-security Login Service
     * @propertyOf auth:LoginCtrl
     */
    // this.service = LoginService;
    /**
     * @ngdoc method
     * @name getMessage
     * @description build a error message if form is not valid
     * @methodOf auth:LoginCtrl
     */
    this.getMessage = function (errors) {
      var message = 'Please check following Fields: ';
      angular.forEach(errors, function (error) {
        message += error.$name + ' ';
      });
      return message;
    };
    /**
     * @ngdoc method
     * @name alert
     * @description a small alert window for the User
     * @methodOf auth:LoginCtrl
     */
    this.alert = function (title, message) {
      AlertService.map({
        cssClass: 'assertive',
        title: title,
        message: message,
        buttons: [
          {
            text: $filter('translate')('CLOSE'),
            type: 'button-calm'
          }
        ]
      });
    };
    /**
     * @ngdoc method
     * @name submit
     * @description form is submitted
     * @methodOf auth:LoginCtrl
     */
    this.submit = function () {
      if (self.form.$valid && !self.state.loginIsInProgress) {
        self.state.loginIsInProgress = true;
        if (self.loader.cssClass === 'error') {
          self.loader.toggle();
          self.loader.cssClass = 'balanced';
        }

        // LoginService login
        Relution.web.login(self.credentials)
          //successfully logged in
          .then(function () {
            self.loader.toggle();
            self.loader.cssClass = 'balanced';
            self.state.loginIsInProgress = false;
            return $state.go('mway.approval.list');
          })
          //error
          .catch(function (e) {
            self.state.loginIsInProgress = false;
            self.loader.cssClass = 'error';
            //mostly offline
            if (e.status === 0) {
              self.alert('Following Errors Occured', 'please check your Internet Connection');
            }
            //Unautthorized
            if (e.status === 403 || e.status === 401) {
              self.alert('Following Errors Occured', 'User is Unauthorized please check your credentials');
            }
            //Url not available
            if (e.status === 404) {
              self.alert('Following Errors Occured', 'This Url is not available');
            }
          });
      } else {
        if (!self.state.loginIsInProgress) {
          //Form not valid
          AlertService.map({
            cssClass: 'assertive',
            title: 'Following Errors Occured',
            message: self.getMessage(self.form.$error.required),
            buttons: [
              {
                text: $filter('translate')('CLOSE'),
                type: 'button-positive'
              }
            ]
          });
        }
      }
    };

    $scope.$on('$ionicView.afterEnter', function () {
      Relution.init({
        serverUrl: Config.ENV.SERVER_URL,
        application: 'workflow'
      })
        .then(function (info) {
          console.log(info);
          console.log(self.form);
        });
    });
  });