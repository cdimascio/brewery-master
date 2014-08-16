'use strict';

require.config({
	paths: {
        util : "./util",
        async: "../bower_components/requirejs-plugins/src/async",
		angular: '../bower_components/angular/angular',
		angularRoute: '../bower_components/angular-route/angular-route',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
        jquery: '../bower_components/jquery/dist/jquery',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		text: '../bower_components/requirejs-text/text',
        slick: '../bower_components/slick-carousel/slick/slick',
        'angular-slick': '../bower_components/angular-slick/dist/slick'
	},
	shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "slick": {
            deps: ["jquery"]
        },
        "angular-slick": {
            deps: ["slick"]
        },
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	},
	priority: [
		"angular"
	]
});

window.name = "NG_DEFER_BOOTSTRAP!";

// Start application
require([
    'jquery',
    'bootstrap',
	'angular',
	'app',
    'app-config',
	'routes',
    'async!http://maps.google.com/maps/api/js?sensor=false',
    'slick',
    'angular-slick'
]);

