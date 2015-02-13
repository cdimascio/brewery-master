/*global $:false, angular:false */
(function () {
    'use strict';

    angular.module('beerApp.directives.ladda', [])
        .directive('ladda', direct);

   function direct() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var ladda = Ladda.create(element[0]);
                scope.$watch(attrs.ladda, function (val) {
                    if (val) {
                        if (!ladda.isLoading()) {
                            ladda.start();
                        }
                    } else if (ladda.isLoading()) {
                        ladda.stop();
                    }
                });
            }
        };
    };
}());