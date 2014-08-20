define(function (require) {
    return ['$scope', function ($scope) {
        var oldVal;
        require('slick');
        $scope.$watch(function() {
            return $scope.answers
        }, function (newVal) {
            if (newVal && oldVal) {
                $('slick').slickGoTo(0);
            }
            oldVal = newVal;
        });

        $scope.$on('QaapiService.answers', function (event, answers) {
            $scope.answers = answers.question.evidencelist;
        });
    }];
});