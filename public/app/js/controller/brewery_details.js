define(function () {
    return ['$scope', 'TweetService', function ($scope, tweetService) {

        // Handle a selection from the Brewery Map
        $scope.$on('BreweryMap.selected', function (event, brewery) {
            handleSelect(brewery);
        });

        // Handle a selection from the Brewery list
        $scope.$on('BreweryListController.selected', function (event, brewery) {
            handleSelect(brewery);
        });

        function handleSelect(brewery) {
            $scope.brewery = brewery;
            tweetService.query(brewery.brewery.name);
        }
    }];
});
