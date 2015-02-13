/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BreweryBeersController', ['ngRoute']).
        controller('BreweryBeersController', ctrl());

    function ctrl() {
        return ['$scope', 'BreweryService', function ($scope, BreweryService) {
            // Handle brewery map selection
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                BreweryService.fetchBeers(brewery.breweryId);
            });

            // Handle brewery list selection
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                BreweryService.fetchBeers(brewery.breweryId);
            });

            // Handle brewery beers available
            $scope.$on('BreweryService.brewery.beers', function (event, beers) {
                $scope.beers = beers.data;
            })

            var cols = $(window).width() < 768 ? 2 : 3;
            // Track rows and columns
            $scope.numColumns = cols;
            $scope.beers = [];
            $scope.rows = [];
            $scope.cols = [];

            // update rows and cols when beers.length changes
            $scope.$watch("beers.length", function () {
                var len = ($scope.beers) ? $scope.beers.length : 0;
                $scope.rows.length = Math.ceil(len / $scope.numColumns);
                $scope.cols.length = $scope.numColumns;
            });

        }];
    }
}());
