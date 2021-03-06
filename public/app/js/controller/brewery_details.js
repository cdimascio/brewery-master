/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BrewerySelectedController', ['ngRoute']).
        controller('BrewerySelectedController', ctrl());

    function ctrl() {
        return ['$scope', function ($scope) {

            // Handle a selection from the Brewery Map
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            // Handle a selection from the Brewery list
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            function handleSelect(brewery) {
                $scope.brewery = brewery;
            }
        }];
    }
}());