'use strict'

define(function () {
    return ['$scope', '$sce', function ($scope, $sce) {
        $scope.$on('UserModelingService.visualization', function (event, visualization) {
            $scope.visualization = $sce.trustAsHtml(visualization);
        });

        $scope.$on('UserModelingService.analysis', function (event, analysis) {
            $scope.analysis = analysis;
            $scope.analysisFlat = (flatten(analysis.tree));
        });
    }];

    function flatten(tree) {
        var arr = [],
            f = function (t, level) {
                if (!t) {
                    return;
                }

                if (level > 0 && (!t.children || level !== 2)) {
                    var obj = {};
                    obj.id = t.id;

                    if (t.children) {
                        obj.title = true;
                    }
                    if (t.percentage) {
                        obj.value = Math.floor(t.percentage * 100) + "%";
                    }
                    arr.push(obj);
                }
                if (t.children && t.id !== 'sbh') {
                    for (var i = 0; i < t.children.length; i++) {
                        f(t.children[i], level + 1);
                    }
                }
            };
        f(tree, 0);
        return arr;
    }
});
