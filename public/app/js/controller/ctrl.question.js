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

            // TODO disable buttons
            qaapiService.query(question).then(function (r) {
                // TODO enable buttons
            });
        }
    }];
});
