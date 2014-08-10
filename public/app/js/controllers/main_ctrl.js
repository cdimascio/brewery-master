define(function () {
        return ['$scope', '$routeParams', function ($scope, $routeParams) {
                $scope.phoneId = $routeParams.phoneId;
        }];
});