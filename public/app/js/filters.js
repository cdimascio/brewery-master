'use strict';

define(['angular'], function (angular) {

	angular.module('beerApp.filters', ['beerApp.services'])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
	}]);
});
