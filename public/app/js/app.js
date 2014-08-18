'use strict';

define(['angular'], function() {
    return angular.module('beerApp', [
        'ngRoute',
        'beerApp.services',
        'beerApp.controllers',
        'slick'
    ]);
});
