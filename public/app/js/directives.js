'use strict';

define(function (require) {
    require('angular').module('beerApp.directives', []).
        directive('ladda', require('directive/dir.ladda')).
        directive('slick', require('directive/dir.angularslick'));
});