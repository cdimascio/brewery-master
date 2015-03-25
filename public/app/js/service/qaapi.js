/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.QaapiService', [])
        .factory('QaapiService', service());

    function service() {
        var baseUrl = 'http://brewerymaster.mybluemix.net';
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;
            return {
                query: query,
                items: items
            };

            function query(question) {
                var request = $http({
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: baseUrl+'/question',
                    data: question
                });
                return request.then(handleSuccess, handleError);
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(response) {
                res = response.data;
                $rootScope.$broadcast("QaapiService.answers", res);
                return res;
            }

            function items() {
                return res;
            }
        }];
    }
}());