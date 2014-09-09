define(function () {
    return ['$scope', 'QaapiService', function ($scope, qaapiService) {
        $scope.text = '';
        $scope.ask = function(text) {
            var question = {
                "question": {
                    "evidenceRequest": {
                        "items": 5
                    },
                    "questionText": text
                }
            };

            // Invoke the qaapi service and show progress
            $scope.isLoading = true;
            qaapiService.query(question).then(function (r) {
                $scope.isLoading = false;
            });
        }
    }];
});
