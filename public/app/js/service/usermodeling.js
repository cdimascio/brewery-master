/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.UserModelingService', [])
        .factory('UserModelingService', service());
    function service() {
        return ['$http', '$q', '$rootScope', 'CONFIG', function ($http, $q, $rootScope, CONFIG) {
            var res = null;
            return {
                profile: profile,
                visualize: visualize
            };

            function profile(userData) {
                var request = $http({
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: CONFIG.apiBase+'/um/profile',
                    data: userData
                });
                $rootScope.$broadcast('UserModelingService.profiling');
                return request.then(handleSuccess('UserModelingService.profile'),
                    handleError('UserModelingService.profile'));
            }

            function visualize(profileData) {
                var request = $http({
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: CONFIG.apiBase+'/um/visualize',
                    data: profileData
                });
                return request.then(handleSuccess('UserModelingService.visualization'),
                    handleError('UserModelingService.visualization'));
            }

            function handleError(topic) {
                return function (response) {
                    if (!angular.isObject(response.data) || !response.data.user_message) {
                        $rootScope.$broadcast(topic, response.data);
                        return $q.reject("An unknown error occurred.");
                    }
                    $rootScope.$broadcast(topic, response.data);
                    return $q.reject(response.data.user_message);
                }
            }

            function handleSuccess(topic) {
                return function (response) {
                    res = response.data;
                    $rootScope.$broadcast(topic, res);
                    return res;
                }
            }
        }];
    }
}());