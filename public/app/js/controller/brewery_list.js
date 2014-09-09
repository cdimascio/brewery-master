define(function () {
    return ['$scope', '$rootScope', '$http', 'BreweryService', function ($scope, $rootScope, $http, breweryService) {

        // Listen for brewery list
        $scope.$on('BreweryService.breweries', function () {
            var data = breweryService.items() && breweryService.items().data;
            // Sort brewery list alphabetically
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
