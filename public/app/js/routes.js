'use strict';

define(['app'], function (app) {
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'app/partials/home.html'
        });
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);
});
