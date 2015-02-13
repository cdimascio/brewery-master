/* global angular:false */
(function () {
    'use strict';

    angular.module('beerApp', [
        'ngRoute',
        'beerApp.services.BreweryService',
        'beerApp.services.LocationService',
        'beerApp.services.QaapiService',
        'beerApp.services.TweetService',
        'beerApp.services.UserModelingService',
        'beerApp.services.MapService',
        'beerApp.services.UmService',
        'beerApp.services.UserModelingService',
        'beerApp.controllers.AnswersController',
        'beerApp.controllers.BreweryBeersController',
        'beerApp.controllers.BrewerySelectedController',
        'beerApp.controllers.BreweryListController',
        'beerApp.controllers.BreweryMapController',
        'beerApp.controllers.QuestionController',
        'beerApp.controllers.TweetController',
        'beerApp.controllers.TweetController',
        'beerApp.controllers.UserModelBuilderController',
        'beerApp.controllers.UserModelResultController',
        'beerApp.directives.slick',
        'beerApp.directives.ladda'
    ]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'app/partials/home.html'
        });
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);
}());
