/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BreweryMapController', ['ngRoute']).
        controller('BreweryMapController', ctrl());

    function ctrl() {
        var map = null;
        return [
            '$scope',
            '$http',
            '$rootScope',
            'BreweryService',
            'LocationService',
            'LocationParserService',
            'MapService',
            function ($scope, $http, $rootScope, BreweryService, LocationService, LocationParserService, MapService) {

                // Handle brewery list selection
                $scope.$on('BreweryListController.selected', function (event, brewery) {
                    if (map) {
                        $scope.brewery = brewery;
                        map.selectMarker(brewery.latitude, brewery.longitude);
                    }
                });

                $rootScope.$on('BreweryService.breweries', function (event, result) {
                    renderMap(result)
                });

                $scope.reRender = function() {
                    renderMap(BreweryService.breweries());
                };


                $scope.$watch('showMap', function() {
                    if (map) {
                        map.resize();
                    }
                });

                $scope.$on('LocationService.location', function(event,r){
                    BreweryService.fetchBreweries(r);
                });

                // Fetch nearby breweries and render using Google maps
                if (!LocationService.location()) {
                    LocationService.locate();
                } else {
                    map = null;
                    BreweryService.fetchBreweries(LocationService.location());
                }
                /**
                 * Displays breweries on Google Maps
                 * @param r The BreweryDB /breweries response object
                 */
                function renderMap(r) {
                    if (!map) {
                        map = MapService.map(document.getElementById('map-canvas'));
                        map.init(searchHandler);
                    } else {
                        map.clearMarkers();
                    }
                    $.each(r.data, function (i, brewery) {
                        map.addMarker(brewery.latitude, brewery.longitude, content(brewery), brewery, clickHandler);
                    });
                    map.fitBounds();
                }

                function content(brewery) {
                    return '<div class="mapInfoContainer">' +
                        '<a href="' + brewery.brewery.website + '" target="_blank">' +
                        brewery.brewery.name + '</a></div>';
                }

                function clickHandler(brewery) {
                    $rootScope.$broadcast('BreweryMap.selected', brewery);
                }

                function searchHandler(evt) {
                    var text = evt.searchText.trim();
                    if (LocationParserService.isState(text.trim())) {
                        BreweryService.fetchBreweries({
                            region : text.trim()
                        });
                    } else {
                        LocationService.lookup(text);
                    }
                }
                //
                //$( window ).resize(function() {
                //    map.resize();
                //});

//                function() {
//                    var dist = $('#footer').offset().top - $('#search').offset().top,
//                        percentDist = 50,
//                        height = element.height() == 0 ? dist : element.height();
//
//
//
//                    if (element.height() > dist) {
//                        percentDist = Math.abs(dist / element.height()) * 100;
//                        percentDist = perce
//                }
            }];
    }
}());
