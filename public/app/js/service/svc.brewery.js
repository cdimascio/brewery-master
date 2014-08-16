define(function () {
    return function ($http, $q, $rootScope) {
        var res = null;
        return {
            query: query,
            items: items
        };

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
            return request.then(handleSuccess, handleError);
        }

        function handleError(response) {
            if (!angular.isObject(response.data) || !response.data.message) {
                return $q.reject("An unknown error occurred.");
            }
            return $q.reject(response.data.message);
        }

        function handleSuccess(response) {
            res = response.data;
            $rootScope.$broadcast("BreweryService.breweries");
            return res;
        }

        function items() {
            return res;
        }

    }
});