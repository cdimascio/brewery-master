define(function () {
    return ['$scope', '$rootScope', '$http', 'BreweryService', function ($scope, $rootScope, $http, blService) {
        $scope.$on('BreweryService.breweries', function () {
            var data = blService.items() && blService.items().data;
            $scope.data = data.sort(function(a, b) {
                if (a.brewery.name < b.brewery.name) {
                    return -1;
                } else if (a.brewery.name > b.brewery.name) {
                    return 1;
                }
                return 0;
            });
        });

        $scope.notifySelect = function (event, brewery) {
            $rootScope.$broadcast('BreweryListController.selected', brewery);
            event.preventDefault();
        };
    }];
});
