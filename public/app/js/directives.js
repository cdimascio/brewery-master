'use strict';

define(function (require) {
    require('angular').module('beerApp.directives', []).
        directive('ladda', require('directive/ladda')).
        directive('slick', require('directive/angular_slick'));
});