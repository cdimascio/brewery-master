define(function (require) {
    var app = require('app'),
        angular = require('angular'),
        module = angular.module('beerApp.services', []);

    module.service("BreweryService", require('service/brewery_svc'));
    module.service('LocationService', require('service/location_svc'));
});
