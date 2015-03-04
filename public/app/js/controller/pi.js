/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.TweetPersonalityController', ['ngRoute']).
        controller('TweetPersonalityController', ctrl());

    function ctrl() {
        return ['$scope', 'UserModelingService', 'UmService', 'TweetService', function ($scope, UserModelingService, UmService, TweetService) {
            $scope.$on('TweetService.tweets', function(event,tweets) {
                if (!tweets) {
                    console.log('no profile data');
                    return;
                }

                $scope.isLoading = false;

                // Convert tweets to a format compatible for
                // the user modeling service
                var profileData = UmService.tweetsToProfileData(tweets);

                // Invoke user modeling service
                UserModelingService.profile(profileData);
            });

//            // Handle available tweets
//            $scope.$on('TweetService.tweets', function (event, tweets) {
//                $scope.tweets = tweets;
//                $scope.isLoading = false;
//            });

            // Handle brewery map selection
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            // Handle brewery list selection
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            function handleSelect(brewery) {
                $scope.isLoading = true;
                $scope.tweets = undefined;
                TweetService.query(brewery.brewery.name);
            }
        }];
    }
}());
