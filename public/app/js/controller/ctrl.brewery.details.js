define(function () {
    return ['$scope', 'TweetService', function ($scope, tweetService) {
        $scope.$on('BreweryMap.selected', function (event, brewery) {
            $scope.brewery = brewery;
            tweetService.query('TODO fix me - harpoon%20brewery');
            console.log('map selected');
            $scope.$apply();
        });
        $scope.$on('BreweryListController.selected', function (event, brewery) {
            $scope.brewery = brewery;
            console.log('TODO fix me - list selected');
            tweetService.query('harpoon%20brewery');
        });
    }];
});
