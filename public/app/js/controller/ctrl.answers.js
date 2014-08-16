define(function (require) {
    return ['$scope', function ($scope) {


     /*  var $ = require('jquery');
        require('slick');
        $('.single-item').slick();
        *//*$('.single-item').slick();*/
        $scope.$on('QaapiService.answers', function (event, answers) {
           /* $scope.slickConfig = {
                dots: true
            };

            $scope.slickHandle = {

            };
            console.log(answers);*/
            $scope.answers = answers.question.evidencelist;
        });
    }];
});