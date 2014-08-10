define(function (require) {
    return ['$scope', '$rootScope', '$http', 'BreweryService', function($scope, $rootScope, $http, blService) {
        $scope.$on('BreweryService.breweries', function() {
            $scope.data = blService.items() && blService.items().data;
        });

        $scope.notifySelect = function(event,brewery) {
            console.log(brewery);
            $rootScope.$broadcast('BreweryListController.selected', brewery);
            event.preventDefault();
        };
    }];
});
