define(function () {
    return ['$scope', 'QaapiService', function ($scope, QaapiService) {
        $scope.text = '';
        $scope.ask = function(text) {
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
});
