/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.MainController', ['ngRoute']).
        controller('MainController', ctrl());

    function ctrl() {
        return ['$scope', '$location', 'BreweryService',
            'LocationService', function ($scope, $location, BreweryService, LocationService) {
            $('#nav').affix({
                offset: {
                    top: $('header').height() - $('#nav').height()
                }
            });

            /* highlight the top nav as scrolling occurs */
            $('body').scrollspy({ target: '#nav' })

            /* smooth scrolling for scroll to top */
            $('.scroll-top').click(function () {
                $('body,html').animate({scrollTop: 0}, 1000);
            })

            /* smooth scrolling for nav sections */
            $('#nav .navbar-nav li>a').click(function () {
                var link = $(this).attr('href');
                var posi = $(link).offset().top + 20;
                $('body,html').animate({scrollTop: posi}, 700);
            });

            $scope.page = 'search';//$location.path() ;

            $scope.$watch("page", function(newVal, oldVal) {
               if (newVal != oldVal) {
                   $scope.page = newVal;
               }
            });


            $scope.$on('$routeUpdate', function(scope, next, current) {
                // Minimize the current widget and maximize the new one
                console.log(current);console.log(next);
                $scope.page = next.params.page;

            });

            // Fetch nearby breweries and render using Google maps
//            if (!LocationService.location()) {
//                LocationService.query().then(function (r) {
////                      r = { city_override : 'San Jose' };
//                    r.local = true;
//                    fetchLocalBreweries(r)
//                });
//            } else {
//                fetchLocalBreweries(LocationService.location())
//            }

            var first = true;
            $scope.$on('BreweryService.breweries', function (event, result) {
                if (first) {
                 //   $('#map-canvas').hide();
                }
                first = false;
            });

            //$scope.showMap = false;
           // $('#map-canvas').hide();
            $scope.toggleMap = function() {
                $scope.showMap = !$scope.showMap;
                if (!first && $scope.showMap) {
                  //  $('#map-canvas').show();
                }

            }

            /**
             * Find breweries near a given location
             * @param loc The location
             * @param callback The callback function to invoke after fetching breweries
             * @param force Force a server query
             */
            function fetchLocalBreweries(loc, callback, force) {
                if (!BreweryService.breweries() || force) {
                    BreweryService.fetchBreweries(loc);
                } else {
                    callback(BreweryService.breweries());
                    BreweryService.notify();
                }
            }


//
//            // Handle a selection from the Brewery Map
//            $scope.$on('BreweryMap.selected', function (event, brewery) {
//                handleSelect(brewery);
//            });
//
//            // Handle a selection from the Brewery list
//            $scope.$on('BreweryListController.selected', function (event, brewery) {
//                handleSelect(brewery);
//            });
//
//            function handleSelect(brewery) {
//              //  $scope.page = '/brewery';
//                $location.search('page','brewery');
//                $scope.brewery = brewery;
//            }
        }];
    }
}());