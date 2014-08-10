define(function (require) {
    var map = null;
    return [
        '$scope',
        '$http',
        '$rootScope',
        'BreweryService',
        'LocationService',
        function($scope, $http, $rootScope, blService, locService) {

        $scope.$on('BreweryListController.selected', function(event, brewery) {
            if (map) {
                $scope.brewery = brewery;
                map.selectMarker(brewery.latitude, brewery.longitude);
            }
        });

        if (!locService.location()) {
            locService.query().then(function(r) {
                fetchLocalBreweries(r)
            });
        }

        function fetchLocalBreweries(loc, force) {
            if (!blService.items() || force) {
                blService.query(loc.region)// TODO loc.region, zip? locality?
                    .then(
                    function (r) {
                        renderMap(r);
                    });
            } else {
                renderMap(blService.items);
            }
        }

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
            return '<div class="mapInfoContainer">'+
                '<a href="' + brewery.brewery.website + '" target="_blank">' +
                brewery.brewery.name + '</a></div>';
        }

        function clickHandler(brewery) {
            $rootScope.$broadcast('BreweryMap.selected', brewery);
        }

        function searchHandler(evt) {
            var loc = {
                region : evt.searchText
            };
            fetchLocalBreweries(loc, true);
        }
    }];
});
