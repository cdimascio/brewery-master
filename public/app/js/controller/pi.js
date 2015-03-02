/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.TweetPersonalityController', ['ngRoute']).
        controller('TweetPersonalityController', ctrl());

    function ctrl() {
        return ['$scope', 'UserModelingService', 'UmService', function ($scope, UserModelingService, UmService) {
            $scope.$on('TweetService.tweets', function(event,tweets) {
                if (!tweets) {
                    console.log('no profile data');
                    return;
                }

                // Convert tweets to a format compatible for
                // the user modeling service
                var profileData = UmService.
                    tweetsToProfileData(tweets);

                // Invoke user modeling service
                UserModelingService.profile(profileData);
            });
        }];
    }
}());
