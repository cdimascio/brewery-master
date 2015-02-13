/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.TweetController', ['ngRoute']).
        controller('TweetController', ctrl());

    function ctrl() {
        return ['$scope', 'TweetService', function ($scope, TweetService) {

            // Handle available tweets
            $scope.$on('TweetService.tweets', function (event, tweets) {
                $scope.tweets = tweets;
            });

            // Handle brewery map selection
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            // Handle brewery list selection
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            function handleSelect(brewery) {
                TweetService.query(brewery.brewery.name);
            }
        }];
    }
}());
