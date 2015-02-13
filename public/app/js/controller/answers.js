/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.AnswersController', ['ngRoute']).
        controller('AnswersController', ctrl());

    function ctrl() {
        return ['$scope', '$sce', function ($scope, $sce) {
            var oldVal;
            $scope.$watch(function () {
                return $scope.result//$scope.answers
            }, function (newVal) {
                if (newVal && oldVal) {
                    $('slick').slickGoTo(0);
                }
                oldVal = newVal;
            });

            $scope.onAfterChange = function () {
                $('div.answer-container a[href^="http://"]').attr('target', '_blank');
            };

            $scope.$on('QaapiService.answers', function (event, answers) {
                $scope.result = answers.question;
            });

            $scope.formattedAnswerText = function (i) {
                if (!$scope.result) return;
                var html = $scope.result.answers[i].formattedText;
                return  $sce.trustAsHtml(html);
            }
        }];
    }
}());