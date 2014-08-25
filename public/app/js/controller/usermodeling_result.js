'use strict'

define(function (require) {
    return ['$scope', '$sce', 'UserModelingService', function ($scope, $sce, userModelingService) {
        $scope.$on('UserModelingService.visualization', function (event, visualization) {
            $scope.visualization = $sce.trustAsHtml(visualization);
        });

        $scope.$on('UserModelingService.analysis', function (event, analysis) {
            var umUtil = require('util/um'),
                filteredAnalysis = umUtil.filterTraits(analysis,traits());

            $scope.analysis = filteredAnalysis;
            $scope.analysisFlat = (umUtil.flatten(filteredAnalysis.tree));
            userModelingService.visualize(filteredAnalysis);
        });
    }];

    function traits() {
        return ['Openness', 'Love', 'Anger', 'Anxiety', 'Cheerfulness',
            'Excitement', 'Self-enhancement', 'Monday', 'Tuesday', 'Friendliness'];
    }
});
