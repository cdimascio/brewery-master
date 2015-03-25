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
                locate: query,
                lookup : lookup
            };

            function lookup(address) {
                var geocoder = new google.maps.Geocoder();
                var latlng;
                geocoder.geocode( {
                    'address': address
                }, function(results, status) {
                    latlng = results[0].geometry.location.lat() +","+ results[0].geometry.location.lng();
                    $rootScope.$broadcast("LocationService.location", {
                        loc : latlng
                    });
                });

            }

            function isPhoneGap() {
                return  document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            }

            function query() {
                $rootScope.$broadcast("LocationService.searching");

                if (isPhoneGap()) {
                    var onReady = function onDeviceReady() {
                      currentLocation();
                    }

                    $(function(){
                        document.addEventListener("deviceready", onReady, false);
                    });
                } else {
                    currentLocation();
                }
            }

            function currentLocation() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        $rootScope.$broadcast("LocationService.location", {
                            loc: position.coords.latitude+","+position.coords.longitude
                        });
                    }, function() {
                        var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
                        return request.then(handleSuccess, handleError);
                    });
                } else {
                    // Use Ip Address to detect location
                    // Browser doesn't support geolocation
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