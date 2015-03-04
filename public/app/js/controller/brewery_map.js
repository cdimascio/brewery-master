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

                $scope.$on('LocationService.location', function(event,r){
                    //r = { city_override : 'San Jose' };
                    r.local = true;
                    fetchLocalBreweries(r, renderMap, true)
                });
                // Fetch nearby breweries and render using Google maps
                if (!LocationService.location()) {
                    LocationService.query();
                } else {
                    map = null;
                    fetchLocalBreweries(LocationService.location(), renderMap)
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
//                    var loc = {
//                        city: evt.searchText // region: for state
//                    };
                    var loc = LocationParserService.parse(evt.searchText);

                    fetchLocalBreweries(loc, renderMap, true);
                }
            }];
    }
}());
