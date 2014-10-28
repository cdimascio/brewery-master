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

        function fetchBreweries(loc) {
            //region: loc.region // by state
            //postalCode loc.postal// by zipcode
            //locality loc.city // by city
            var params = {};
            if (loc.city) params.locality = loc.city;
            if (loc.region) params.region = loc.region;
            var request = $http({
                method: "get",
                url: '/breweries',
                params: params
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