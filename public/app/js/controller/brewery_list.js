/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BreweryListController', ['ngRoute']).
        controller('BreweryListController', ctrl());

    function ctrl() {
        return ['$scope', '$rootScope', '$http', '$location', 'LocationService','LocationParserService', 'BreweryService',
            function ($scope, $rootScope, $http, $location, LocationService, LocationParserService, BreweryService) {

            $scope.$on('LocationService.searching', function(){
                dim();
            });

            // Listen for brewery list
            $scope.$on('BreweryService.breweries', function () {
                var data = BreweryService.breweries() && BreweryService.breweries().data;
                // Sort brewery list alphabetically
                if (!data) {
                    light();
                    return;
                }
                $scope.data = data.sort(function (a, b) {
                    if (a.distance) {
                        // try to sort by distance
                        if (a.distance < b.distance) return -1;
                        else return 1;
                    } else {
                        // otherwise sort by name
                        if (a.brewery.name < b.brewery.name) {
                            return -1;
                        } else if (a.brewery.name > b.brewery.name) {
                            return 1;
                        }
                    }
                    return 0;

                });

                light();
            });
            $scope.notifySelect = function (event, brewery) {
                $rootScope.$broadcast('BreweryListController.selected', brewery);
                event.preventDefault();
            };

            $scope.locate = function() {
                LocationService.locate();
                dim();
            };

            $scope.search = function(text, event) {
                dim();
                event.target.focus();

                if (LocationParserService.isState(text.trim())) {
                    BreweryService.fetchBreweries({
                        region : text.trim()
                    });
                } else {
                    LocationService.lookup(text);
                }
            };

            $('.brewery-list-table > tr').click($scope.notifySelect);
        }];

        // TODO move to separate controller
        var spinner;
        function light() {
            if (spinner) spinner.stop();
            $('.location-progress-overlay').hide();
        }
        function dim() {
            var element =  $('.brewery-list-table'), // element to cover
                overlay = $('.location-progress-overlay'),
                position = element.offset(),
                top = position.top + Number(element.css("padding-top").replace(/px/,''));

            var dist = $('#footer').offset().top - $('#search').offset().top,
                percentDist = 50,
                height = element.height() == 0 ? dist : element.height();



            if (element.height() > dist) {
                percentDist = Math.abs(dist / element.height()) * 100;
                percentDist = percentDist / 2; // half the dist of prev calculation should be the middle
            }

            percentDist *= .8;

            overlay.css({
                position: "absolute", left: position.left, top: top,
                width: $(window).width(),
                height: height,
                background: "#fff",
                opacity:0.6

            });

            overlay.show();

            var opts = {
                lines: 10, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 10, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 85, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#666',//'008cba', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner',//, // The CSS class to assign to the spinner
                /*    zIndex: 2e9, // The z-index (defaults to 2000000000)*/
                top: percentDist+'%' // Top position relative to parent
                /*left: '50%' // Left position relative to parent*/
            };
            if (spinner) {
                spinner.stop()
            }
            spinner = new Spinner(opts);
            spinner = spinner.spin(overlay[0]);

        }
    }
}());


