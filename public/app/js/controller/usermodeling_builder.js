/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.UserModelBuilderController', ['ngRoute']).
        controller('UserModelBuilderController', ctrl());

    function ctrl() {
        return ['$scope', 'UserModelingService', 'UmService', function ($scope, UserModelingService, UmService) {
            $scope.build = function () {
                if (!$scope.$parent.tweets) {
                    console.log('no profile data');
                    return;
                }

                // Convert tweets to a format compatible for
                // the user modeling service
                var profileData = UmService.
                    tweetsToProfileData($scope.$parent.tweets);

                // Invoke user modeling service
                UserModelingService.profile(profileData);
            }
        }];
    }
}());
