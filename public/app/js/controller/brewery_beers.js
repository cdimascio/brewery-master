define(function () {
    return ['$scope', 'BreweryService', function ($scope, breweryBeers) {
        $scope.$on('BreweryMap.selected', function (event, brewery) {
            breweryBeers.beers(brewery.breweryId);
        });
        $scope.$on('BreweryListController.selected', function (event, brewery) {
            breweryBeers.beers(brewery.breweryId);
        });
        $scope.$on('BreweryService.brewery.beers', function(event, beers) {
            $scope.beers = beers.data;
        })

        $scope.numColumns = 3;
        $scope.beers = [];
        $scope.rows = [];
        $scope.cols = [];
        $scope.$watch("beers.length", function(){
            var len = ($scope.beers) ? $scope.beers.length : 0;
            $scope.rows.length = Math.ceil(len / $scope.numColumns);
            $scope.cols.length = $scope.numColumns;
        });

    }];
});
