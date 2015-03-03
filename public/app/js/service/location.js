/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.LocationService', [])
        .factory('LocationService', service());

    function service() {
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;

            return {
                location: location,
                query: query
            };

            function query() {
                $rootScope.$broadcast("LocationService.searching");
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        $rootScope.$broadcast("LocationService.location", {
                            loc: position.coords.latitude+","+position.coords.longitude
                        });

//                        var pos = new google.maps.LatLng(position.coords.latitude,
//                            position.coords.longitude);
//
//                        var infowindow = new google.maps.InfoWindow({
//                            map: map,
//                            position: pos,
//                            content: 'Location found using HTML5.'
//                        });
//
//                        map.setCenter(pos);
                    }, function() {
                        var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
                        return request.then(handleSuccess, handleError);
                    });
                } else {
                    // USE IP
                    // browser doesn't support geolocation
                    //handleNoGeolocation(false);
                    var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
                    return request.then(handleSuccess, handleError);
                }
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(response) {
                res = response.data;
                $rootScope.$broadcast("LocationService.location", res);
                return res;
            }

            function location() {
                return res;
            }
        }];
    }
}());