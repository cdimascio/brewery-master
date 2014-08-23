'use strict';

define(function (require) {
    require('angular');
    require('spin');
    var Ladda = require('ladda');
    return function () {
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
});