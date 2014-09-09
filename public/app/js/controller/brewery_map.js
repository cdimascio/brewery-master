define(function (require) {
    var map = null;
    return [
        '$scope',
        '$http',
        '$rootScope',
        'BreweryService',
        'LocationService',
        function ($scope, $http, $rootScope, breweryService, locationService) {

            // Handle brewery list selection
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                if (map) {
                    $scope.brewery = brewery;
                    map.selectMarker(brewery.latitude, brewery.longitude);
                }
            });

            // Fetch nearby breweries and render using Google maps
            if (!locationService.location()) {
                locationService.query().then(function (r) {
                    fetchLocalBreweries(r, renderMap);
                });
            }

            /**
             * Find breweries near a given location
             * @param loc The location
             * @param callback The callback function to invoke after fetching breweries
             * @param force Force a server query
             */
            function fetchLocalBreweries(loc, callback, force) {
                if (!breweryService.items() || force) {
                    breweryService.query(loc.region)// TODO loc.region, zip? locality?
                        .then(
                        function (r) {
                            callback(r);
                        });
                } else {
                    callback(breweryService.items);
                }
            }

            /**
             * Displays breweries on Google Maps
             * @param r The BreweryDB /breweries response object
             */
            function renderMap(r) {
                if (!map) {
                    map = require('util/maps')(document.getElementById('map-canvas'));
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
                var loc = {
                    region: evt.searchText
                };
                fetchLocalBreweries(loc, renderMap, true);
            }
        }];
});
