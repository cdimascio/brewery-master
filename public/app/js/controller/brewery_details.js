define(function () {
    return ['$scope', 'TweetService', function ($scope, tweetService) {
        $scope.$on('BreweryMap.selected', function (event, brewery) {
            $scope.brewery = brewery;
            tweetService.query(brewery.brewery.name);
        });
        $scope.$on('BreweryListController.selected', function (event, brewery) {
            $scope.brewery = brewery;
            tweetService.query(brewery.brewery.name);
        });
    }];
});
