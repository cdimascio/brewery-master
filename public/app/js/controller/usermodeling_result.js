'use strict'

define(function (require) {
    return ['$scope', '$sce', 'UserModelingService', function ($scope, $sce, UserModelingService) {
        $scope.$on('UserModelingService.visualization', function (event, visualization) {
            $scope.visualization = $sce.trustAsHtml(visualization);
        });

        $scope.$on('UserModelingService.profile', function (event, analysis) {
            var umUtil = require('util/um'),
                filteredAnalysis = umUtil.filterTraits(analysis,traits());

            $scope.analysis = filteredAnalysis;
            $scope.analysisFlat = (umUtil.flatten(filteredAnalysis.tree));

            UserModelingService.visualize(filteredAnalysis);
        });
    }];

    function traits() {
        return ['Extraversion', 'Openness', 'Excitement', 'Friendliness',
            'Love', 'Anger', 'Cheerfulness'];
    }
});
