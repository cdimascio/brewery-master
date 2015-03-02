/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.UserModelResultController', ['ngRoute']).
        controller('UserModelResultController', ctrl());

    function ctrl() {
        return ['$scope', '$sce', 'UserModelingService', 'UmService', function ($scope, $sce, UserModelingService, UmService) {
            $scope.$on('UserModelingService.visualization', function (event, visualization) {
                $scope.visualization = $sce.trustAsHtml(visualization);
            });

            $scope.$on('UserModelingService.profile', function (event, analysis) {
                if (analysis.error_code || (analysis.code && analysis.code != 200)) {
                    $scope.error = analysis.user_message || analysis.error;
                    return;
                }
                // TODO Traits can be filtered, however /visualize endpoint
                // To keep only traits returned by traits()
                // Uncomment the following line and replace all values 'analysis' with 'filteredAnalysis'
                // var filteredAnalysis = UmService.filterTraits(analysis,traits());
                $scope.analysis = analysis;

                $scope.error = undefined;
                $scope.categories = UmService.categories(analysis.tree);
                $scope.analysisFlat = (UmService.flatten($scope.categories));
                $scope.analysisKeys = Object.keys($scope.analysisFlat);

                UserModelingService.visualize(analysis);
            });
        }];

        function traits() {
            return ['Extraversion', 'Openness', 'Excitement', 'Friendliness',
                'Love', 'Anger', 'Cheerfulness'];
        }
    }
}());
