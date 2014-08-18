define(function (require) {
    return ['$scope', function ($scope) {
        $scope.$on('QaapiService.answers', function (event, answers) {
            $scope.answers = answers.question.evidencelist;
        });
    }];
});