define(function () {
    return['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
        return {
            query : query
        };

        function query(text) {
            var request = $http({
                method: "get",
                url: '/tweet',
                params: {
                    q: text,
                    count: 100
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
            var res = response.data.tweets;
            $rootScope.$broadcast("TweetService.tweets", res);
            return res;
        }
    }];
});