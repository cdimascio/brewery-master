define(function () {
    return function ($http, $q, $rootScope) {
        var res = null;

        return {
            location: location,
            query: query
        };

        function query() {
            var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
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
            $rootScope.$broadcast("LocationService.location", res);
            return res;
        }

        function location() {
            return res;
        }
    };
});