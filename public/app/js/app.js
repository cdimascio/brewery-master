'use strict';

define([
	'angular',
	'angularRoute',
	], function (angular, filters) {
		return angular.module('beerApp', [
			'ngRoute',
            'beerApp.controllers',
            'beerApp.services',
            'slick'
		]);
});
