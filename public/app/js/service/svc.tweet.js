define(function () {
    return function ($http, $q, $rootScope) {
        return {
            query : query
        };

        function query(text) {
            var request = $http({
                method: "get",
                url: '/tweet',
                params: {
                    text: text
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
    };
});
/*
function TweetsCntl($scope, $http) {
    $http.jsonp('http://search.twitter.com/search.json'
        + '?q=angularjs&rpp=100&include_entities=true&result_type=mixed'
        + '&callback=JSON_CALLBACK')
        .success(function(data, status) {
            $scope.tweets = data.results;
            for (var i = 0 ; i < $scope.tweets.length ; i ++) {
                $scope.tweets[i].date = Date.parse($scope.tweets[i].created_at);
            }
        });
}*/
