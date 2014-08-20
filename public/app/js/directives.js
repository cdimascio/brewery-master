'use strict';

define(function (require) {
    require('angular').module('beerApp.ladda', []).
        directive('ladda', require('directive/directive.ladda'));
});