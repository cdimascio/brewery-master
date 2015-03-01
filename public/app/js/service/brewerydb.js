/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.BreweryService', [])
        .factory('BreweryService', service());

    function service() {
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;
            return {
                fetchBreweries: fetchBreweries,
                fetchBeers: fetchBeers,
                breweries: breweries,
                notify : notify
            };

            function fetchBeers(breweryId) {
                var request = $http({
                    method: "get",
                    url: '/brewery/' + breweryId + '/beers'
                });
                return request.then(handleSuccess('BreweryService.brewery.beers'), handleError);
            }

            function fetchBreweries(loc) {
                return fetchBreweriesH(loc);
            }

            function fetchBreweriesH(loc, tryNum) {
                //region: loc.region // by state
                //postalCode loc.postal// by zipcode
                //locality loc.city // by city
                var params = {};

                if (loc.city_override) {
                    params.locality = loc.city_override;
                } else {
                    if (loc.city) params.locality = loc.city;
                    if (!loc.city && loc.region) params.region = loc.region;
                }
//            if (loc.region) params.region = loc.region;
//            if (!loc.region && loc.city) params.locality = loc.city;
                var request = $http({
                    method: "get",
                    url: '/breweries',
                    params: params
                });
                return request.then(handleSuccess('BreweryService.breweries', loc, tryNum), handleError);
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(topic, loc, tryNum) {
                return function (response) {

                    if ((!tryNum || tryNum == 0) && !response.data.data) {
                        if (!loc) {
                            console.log('no location');
                            return response.data;
                        }
                        if (loc.local) {
                            fetchBreweries({region: loc.region}, 1);
                        } else {
                            fetchBreweries({region: loc.city}, 1);
                        }
                        return response.data;
                    }
                    res = response.data;

                    $rootScope.$broadcast(topic, res);
                    return res;
                }
            }

            function notify() {
                $rootScope.$broadcast('BreweryService.breweries', breweries());
            }

            /**
             * Return any previously fetched breweries
             * @returns {*}
             */
            function breweries() {
                return res;
            }

        }];
    }
}());