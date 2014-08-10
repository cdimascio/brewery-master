define(function (require) {
    return ['$scope', '$http', '$rootScope', 'BreweryService', 'LocationService', function($scope, $http, $rootScope, blService, locService) {
        if (!locService.location()) {
            locService.query().then(function(r) {
                fetchLocalBreweries(r)
            });
        }

        function fetchLocalBreweries(loc) {
            if (!blService.items()) {
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
            var map = require('util/maps')(document.getElementById('map-canvas'));
            map.init();

            $.each(r.data, function (i, brewery) {
                map.addMarker(brewery.latitude, brewery.longitude, content(brewery), brewery, clickHandler);
            });
        }

        function content(brewery) {
            return '<h4>' + brewery.brewery.name + '</h4>'+
                '<a href="' + brewery.brewery.website + '" target="_blank">' + brewery.brewery.name + '</a>';
        }

        function clickHandler(brewery) {
            $rootScope.$broadcast('BreweryMap.selected', brewery);
        }
    }];
});
