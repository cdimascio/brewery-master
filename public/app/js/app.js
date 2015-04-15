/* global angular:false */
(function () {
    'use strict';

    var base = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
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
        'beerApp.services.LocationParserService',
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
        'beerApp.directives.ladda',
        'beerApp.controllers.MainController',
        'beerApp.controllers.TweetPersonalityController'
    ]).
    constant('CONFIG', {
        apiBase : base
    }).
    config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/home?page=brewery', {
            redirectTo: 'app/parts/home.html?page=search' //,
       //    reloadOnSearch: false
        });

        $routeProvider.when('/home', {
            templateUrl: 'app/parts/home.html',
            reloadOnSearch: false
        });

        $routeProvider.when('/brewery', {
            templateUrl: 'app/parts/home.html#brewery',
            reloadOnSearch: false
        });
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);



    function isPhoneGap() {
        return  document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    }

    if (isPhoneGap()) {
        var onReady = function onDeviceReady() {
            currentLocation();
        }

        $(function(){
            document.addEventListener("deviceready", onReady, false);
        });
    }


    function currentLocation() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
//                $rootScope.$broadcast("LocationService.location", {
//                    loc: position.coords.latitude+","+position.coords.longitude
//                });
            }, function() {
//                var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
//                return request.then(handleSuccess, handleError);
            });
        }
    }
}());
