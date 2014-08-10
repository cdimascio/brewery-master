'use strict';
define(function (require) {
    var app = require('app'),
        angular = require('angular'),
        module = angular.module('beerApp.controllers', ['beerApp.services']);

    module.controller('BreweryMapController', require('controllers/brewery_map_ctrl'));
    module.controller('BreweryListController', require('controllers/brewery_list_ctrl'));
    module.controller('BrewerySelectedController', require('controllers/brewery_brewery_ctrl'));
});
