define(function () {
    return ['$scope', 'BreweryService', function ($scope, breweryService) {
        // Handle brewery map selection
        $scope.$on('BreweryMap.selected', function (event, brewery) {
            breweryService.beers(brewery.breweryId);
        });

        // Handle brewery list selection
        $scope.$on('BreweryListController.selected', function (event, brewery) {
            breweryService.beers(brewery.breweryId);
        });

        // Handle brewery beers available
        $scope.$on('BreweryService.brewery.beers', function(event, beers) {
            $scope.beers = beers.data;
        })

        // Track rows and columns
        $scope.numColumns = 3;
        $scope.beers = [];
        $scope.rows = [];
        $scope.cols = [];

        // update rows and cols when beers.length changes
        $scope.$watch("beers.length", function(){
            var len = ($scope.beers) ? $scope.beers.length : 0;
            $scope.rows.length = Math.ceil(len / $scope.numColumns);
            $scope.cols.length = $scope.numColumns;
        });

    }];
});
