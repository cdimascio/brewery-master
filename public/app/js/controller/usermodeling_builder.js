'use strict';

define(function (require) {
    return ['$scope', 'UserModelingService', function ($scope, UserModelingService) {
        $scope.build = function () {
            if (!$scope.$parent.tweets) {
                console.log('no profile data');
                return;
            }

            // Convert tweets to a format compatible for
            // the user modeling service
            var profileData = require('util/um').
                tweetsToProfileData($scope.$parent.tweets);

            // Invoke user modeling service
	        UserModelingService.profile(profileData);
        }
    }];
});
