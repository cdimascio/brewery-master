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

	    userModelingService.analyze(profileData);
        }
    }];
});
