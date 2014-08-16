define(function () {
    return function ($http, $q, $rootScope) {
        var res = null;
        return {
            query: query,
            items: items
        };

        function query(question) {
            var request = $http({
                method: "post",
                url: '/question',
                data : question
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
            $rootScope.$broadcast("QaapiService.answers", res);
            return res;
        }

        function items() {
            return res;
        }
    }
});