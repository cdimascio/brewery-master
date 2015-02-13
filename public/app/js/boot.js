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
        spin: '../bower_components/spin.js/spin',
        ladda: '../bower_components/ladda/dist/ladda.min'
	},
	shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "slick": {
            deps: ["jquery"]
        },
        "spin" : {
            exports : "Spinner"
        },
        "ladda": {
            deps: ['spin'],
            exports: "Ladda"
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

require([
    'angular',
    'angularRoute',
    'jquery',
    'bootstrap',
    'app',
    'controllers',
    'services',
    'directives',
    'filters',
    'routes',
    'async!http://maps.google.com/maps/api/js?sensor=false',
    'slick',
    'spin',
    'ladda',
    'text'
], function () {
    angular.bootstrap(document, ['beerApp']);
});
