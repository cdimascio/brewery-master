'use strict'

define(function (require) {
    return ['$scope', '$sce', 'UserModelingService', function ($scope, $sce, UserModelingService) {
        $scope.$on('UserModelingService.visualization', function (event, visualization) {
            $scope.visualization = $sce.trustAsHtml(visualization);
        });

        $scope.$on('UserModelingService.profile', function (event, analysis) {
            if (analysis.error_code) {
                $scope.error = analysis.user_message;
                return;
            }
            var umUtil = require('util/um');
            // TODO Traits can be filtered, however /visualize endpoint
            // To keep only traits returned by traits()
            // Uncomment the following line and replace all values 'analysis' with 'filteredAnalysis'
            //var filteredAnalysis = umUtil.filterTraits(analysis,traits());
            $scope.analysis = analysis;

            $scope.error = undefined;
            $scope.analysisFlat = (umUtil.flatten(analysis.tree));

            UserModelingService.visualize(analysis);
        });
    }];

    function traits() {
        return ['Extraversion', 'Openness', 'Excitement', 'Friendliness',
            'Love', 'Anger', 'Cheerfulness'];
    }
});
