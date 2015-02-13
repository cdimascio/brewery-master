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
                if (analysis.error_code) {
                    $scope.error = analysis.user_message;
                    return;
                }
                // TODO Traits can be filtered, however /visualize endpoint
                // To keep only traits returned by traits()
                // Uncomment the following line and replace all values 'analysis' with 'filteredAnalysis'
                //var filteredAnalysis = umUtil.filterTraits(analysis,traits());
                $scope.analysis = analysis;

                $scope.error = undefined;
                $scope.analysisFlat = (UmService.flatten(analysis.tree));

                UserModelingService.visualize(analysis);
            });
        }];

        function traits() {
            return ['Extraversion', 'Openness', 'Excitement', 'Friendliness',
                'Love', 'Anger', 'Cheerfulness'];
        }
    }
}());
