'use strict';

define(['angular', 'app'], function(angular, app) {

	return app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'app/partials/home.html',
            controller: 'MainController'
        });
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});
