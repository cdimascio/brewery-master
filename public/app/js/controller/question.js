/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.QuestionController', ['ngRoute']).
        controller('QuestionController', ctrl());

    function ctrl() {
        return ['$scope', 'QaapiService', function ($scope, QaapiService) {
            $scope.text = '';
            $scope.ask = function (text, event) {
                event.target.focus();
                var question = {
                    "question": {
                        "evidenceRequest": {
                            "items": 5
                        },
                        "formattedAnswer": true,
                        "questionText": text
                    }
                };

                // Invoke the qaapi service and show progress
                $scope.isLoading = true;
                QaapiService.query(question).then(function (r) {
                    $scope.isLoading = false;
                });
            }
        }];
    }
}());
