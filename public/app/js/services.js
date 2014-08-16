define(function (require) {
    var app = require('app'),
        angular = require('angular'),
        module = angular.module('beerApp.services', []);

    module.service("BreweryService", require('service/svc.brewery'));
    module.service('LocationService', require('service/svc.location'));
    module.service('QaapiService', require('service/svc.qaapi'));
});
