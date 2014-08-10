define(['app'], function (app) {

    requirejs([
        'controllers',
        'directives',
        'filters',
        'routes',
        'services'], function () {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['beerApp']);
        });
    });

});