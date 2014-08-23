define(function () {
    return function ($http, $q, $rootScope) {
        var res = null;
        return {
            query: query,
            beers: beers,
            items: items
        };

        function beers(breweryId) {
            var request = $http({
                method: "get",
                url: '/brewery/'+breweryId+'/beers'
            });
            return request.then(handleSuccess('BreweryService.brewery.beers'), handleError);
        }

        function query(locality, region) {
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
/*
        function handleSuccess(response) {
            res = response.data;
            $rootScope.$broadcast("BreweryService.breweries");
            return res;
        }*/

        function handleSuccess(topic) {
            return function (response) {
                res = response.data;
                $rootScope.$broadcast(topic, res);
                return res;
            }
        }
        function items() {
            return res;
        }

    }
});