'use strict';
define(function (require) {
    var app = require('app'),
        angular = require('angular'),
        module = angular.module('beerApp.controllers', ['beerApp.services']);

    module.controller('BreweryMapController', require('controller/ctrl.brewery.map'));
    module.controller('BreweryListController', require('controller/ctrl.brewery.list'));
    module.controller('BrewerySelectedController', require('controller/ctrl.brewery.details'));
    module.controller('AnswersController', require('controller/ctrl.answers'));
    module.controller('QuestionController', require('controller/ctrl.question'));
});
