define(function () {
    return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
        var res = null;
        return {
            fetchBreweries: fetchBreweries,
            fetchBeers: fetchBeers,
            breweries: breweries
        };

        function fetchBeers(breweryId) {
            var request = $http({
                method: "get",
                url: '/brewery/'+breweryId+'/beers'
            });
            return request.then(handleSuccess('BreweryService.brewery.beers'), handleError);
        }

        function fetchBreweries(locality, region) {
            var request = $http({
                method: "get",
                url: '/breweries',
                params: {
                    region: locality
                    //postalCode
                    //locality
                }
            });
            return request.then(handleSuccess('BreweryService.breweries'), handleError);
        }

        function handleError(response) {
            if (!angular.isObject(response.data) || !response.data.message) {
                return $q.reject("An unknown error occurred.");
            }
            return $q.reject(response.data.message);
        }

        function handleSuccess(topic) {
            return function (response) {
                res = response.data;
                $rootScope.$broadcast(topic, res);
                return res;
            }
        }

        /**
         * Return any previously fetched breweries
         * @returns {*}
         */
        function breweries() {
            return res;
        }

    }];
});