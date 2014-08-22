define(function () {
    return ['$scope', function ($scope) {
        $scope.$on('TweetService.tweets', function (event, tweets) {
            $scope.tweets = tweets;
        });
    }];
});
