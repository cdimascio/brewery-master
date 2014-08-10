define(function (require) {
    return ['$scope', '$http', 'BreweryService', function($scope, $http, blService) {
        $scope.$on('BreweryService.breweries', function() {
            $scope.data = blService.items() && blService.items().data;
        });
       // $scope.$apply();
    }];
});
