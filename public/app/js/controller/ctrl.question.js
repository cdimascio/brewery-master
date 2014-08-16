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
            }

            qaapiService.query(question).then(function (r) {
                // TODO disable buttons
                console.log(r);
                // TODO enable buttons
            });
        }
    }];
});
