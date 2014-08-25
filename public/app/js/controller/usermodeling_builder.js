'use strict';

define(function (require) {
    return ['$scope', 'UserModelingService', function ($scope, userModelingService) {
        $scope.build = function () {
            if (!$scope.$parent.tweets) {
                console.log('no profile data');
                return;
            }

            var profileData = require('util/um').
                tweetsToProfileData($scope.$parent.tweets);

	    userModelingService.analyze(profileData).then(function (r) {
/*	        var keepTraits = ['Openness', 'Love', 'Anger', 'Anxiety', 'Cheerfulness', 'Excitement', 'Self-enhancement', 'Monday', 'Tuesday', 'Friendliness'];
	        var r = require('util/um').filterTraits(r,keepTraits);
	        userModelingService.visualize(r).then(function (r) {
                })*/
            });
        }
    }];
});
