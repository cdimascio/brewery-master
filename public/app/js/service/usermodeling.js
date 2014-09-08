define(function () {
    return function ($http, $q, $rootScope) {
        var res = null;
        return {
            analyze: analyze,
            visualize: visualize
        };

        function analyze(userData) {
            var request = $http({
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                url: '/um/profile',
                data : userData
            });
            return request.then(handleSuccess('UserModelingService.analysis'), handleError);
        }

        function visualize(profileData) {
            var request = $http({
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                url: '/um/visualize',
                data : profileData
            });
            return request.then(handleSuccess('UserModelingService.visualization'), handleError);
        }

        function handleError(response) {
            if (!angular.isObject(response.data) || !response.data.message) {
                return $q.reject("An unknown error occurred.");
            }
            return $q.reject(response.data.message);
        }

        function handleSuccess(topic) {
            return function(response) {
                res = response.data;
                $rootScope.$broadcast(topic, res);
                return res;
            }
        }
    }
});