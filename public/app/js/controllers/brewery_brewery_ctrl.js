define(function (require) {
    return ['$scope', function($scope) {
        $scope.$on('BreweryMap.selected', function(event, brewery) {
            $scope.brewery = brewery;
            $scope.$apply();
        });
        $scope.$on('BreweryListController.selected', function(event, brewery) {
            $scope.brewery = brewery;
            //$scope.$apply();
        });
    }];
});
