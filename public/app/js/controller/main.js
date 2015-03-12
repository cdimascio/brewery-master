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

            $('body').scrollspy({ target: '#nav' })

            $('.scroll-top').click(function () {
                $('body,html').animate({scrollTop: 60}, 1000);
            })

            $('#nav .navbar-nav li>a').click(function () {
                var link = $(this).attr('href');
//                var posi = $(link).offset().top + 20;
//                $('body,html').animate({scrollTop: posi}, 700);
                $(".navbar-toggle").click();
            });

            $scope.page = 'search';
            $location.search('page', $scope.page);

            $scope.$watch("page", function(newVal, oldVal) {
               if (newVal != oldVal) {
                   $scope.page = newVal;
               }
            });

            $scope.$on('$routeUpdate', function(scope, next, current) {
                // console.log(current);console.log(next);
                $scope.page = next.params.page;

            });

            $scope.toggleMap = function() {
                $scope.showMap = !$scope.showMap;
            };

            $scope.showaMap = function() {
                $scope.showMap = true;
            };

            $scope.showList = function() {
                $scope.showMap = false;
            };

            $scope.locate = function() {
                LocationService.locate();
            };
        }];
    }
}());