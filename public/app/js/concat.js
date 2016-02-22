/* global angular:false */
(function () {
    'use strict';

    angular.module('beerApp', [
        'ngRoute',
        'beerApp.services.BreweryService',
        'beerApp.services.LocationService',
        'beerApp.services.LocationParserService',
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
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.AnswersController', ['ngRoute']).
        controller('AnswersController', ctrl());

    function ctrl() {
        return ['$scope', '$sce', function ($scope, $sce) {
            var oldVal;
            $scope.$watch(function () {
                return $scope.result//$scope.answers
            }, function (newVal) {
                if (newVal && oldVal) {
                    $('slick').slickGoTo(0);
                }
                oldVal = newVal;
            });

            $scope.onAfterChange = function () {
                $('div.answer-container a[href^="http://"]').attr('target', '_blank');
            };

            $scope.$on('QaapiService.answers', function (event, answers) {
                $scope.result = answers.question;
            });

            $scope.formattedAnswerText = function (i) {
                if (!$scope.result) return;
                var html = $scope.result.answers[i].formattedText;
                return  $sce.trustAsHtml(html);
            }
        }];
    }
}());/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BreweryBeersController', ['ngRoute']).
        controller('BreweryBeersController', ctrl());

    function ctrl() {
        return ['$scope', 'BreweryService', function ($scope, BreweryService) {
            // Handle brewery map selection
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                BreweryService.fetchBeers(brewery.breweryId);
            });

            // Handle brewery list selection
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                BreweryService.fetchBeers(brewery.breweryId);
            });

            // Handle brewery beers available
            $scope.$on('BreweryService.brewery.beers', function (event, beers) {
                $scope.beers = beers.data;
            })

            var cols = $(window).width() < 768 ? 2 : 3;
            // Track rows and columns
            $scope.numColumns = cols;
            $scope.beers = [];
            $scope.rows = [];
            $scope.cols = [];

            // update rows and cols when beers.length changes
            $scope.$watch("beers.length", function () {
                var len = ($scope.beers) ? $scope.beers.length : 0;
                $scope.rows.length = Math.ceil(len / $scope.numColumns);
                $scope.cols.length = $scope.numColumns;
            });

        }];
    }
}());
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BrewerySelectedController', ['ngRoute']).
        controller('BrewerySelectedController', ctrl());

    function ctrl() {
        return ['$scope', function ($scope) {

            // Handle a selection from the Brewery Map
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            // Handle a selection from the Brewery list
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            function handleSelect(brewery) {
                $scope.brewery = brewery;
            }
        }];
    }
}());/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BreweryListController', ['ngRoute']).
        controller('BreweryListController', ctrl());

    function ctrl() {
        return ['$scope', '$rootScope', '$http', 'BreweryService', function ($scope, $rootScope, $http, BreweryService) {

            // Listen for brewery list
            $scope.$on('BreweryService.breweries', function () {
                var data = BreweryService.breweries() && BreweryService.breweries().data;
                // Sort brewery list alphabetically
                $scope.data = data.sort(function (a, b) {
                    if (a.brewery.name < b.brewery.name) {
                        return -1;
                    } else if (a.brewery.name > b.brewery.name) {
                        return 1;
                    }
                    return 0;
                });
            });

            $scope.notifySelect = function (event, brewery) {
                $rootScope.$broadcast('BreweryListController.selected', brewery);
                event.preventDefault();
            };
        }];
    }
}());
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.BreweryMapController', ['ngRoute']).
        controller('BreweryMapController', ctrl());

    function ctrl() {
        var map = null;
        return [
            '$scope',
            '$http',
            '$rootScope',
            'BreweryService',
            'LocationService',
            'LocationParserService',
            'MapService',
            function ($scope, $http, $rootScope, BreweryService, LocationService, LocationParserService, MapService) {
                $scope.isLoading = true;

                // Handle brewery list selection
                $scope.$on('BreweryListController.selected', function (event, brewery) {
                    if (map) {
                        $scope.brewery = brewery;
                        map.selectMarker(brewery.latitude, brewery.longitude);
                    }
                });

                $rootScope.$on('BreweryService.breweries', function (event, result) {
                    renderMap(result);
                    $scope.isLoading = false;
                });

                $scope.reRender = function() {
                    renderMap(BreweryService.breweries());
                };

                $scope.$on('LocationService.location', function(event,r){
                    BreweryService.fetchBreweries(r);
                });

                $scope.$on('LocationService.searching', function(event, r) {
                    $scope.isLoading == true;
                });

                // Fetch nearby breweries and render using Google maps
                if (!LocationService.location()) {
                    LocationService.locate();
                } else {
                    map = null;
                    BreweryService.fetchBreweries(LocationService.location());
                }
                /**
                 * Displays breweries on Google Maps
                 * @param r The BreweryDB /breweries response object
                 */
                function renderMap(r) {
                    if (!map) {
                        map = MapService.map(document.getElementById('map-canvas'));
                        map.init(searchHandler);
                    } else {
                        map.clearMarkers();
                    }
                    $.each(r.data, function (i, brewery) {
                        map.addMarker(brewery.latitude, brewery.longitude, content(brewery), brewery, clickHandler);
                    });
                    map.fitBounds();
                }

                function content(brewery) {
                    return '<div class="mapInfoContainer">' +
                        '<a href="' + brewery.brewery.website + '" target="_blank">' +
                        brewery.brewery.name + '</a></div>';
                }

                function clickHandler(brewery) {
                    $rootScope.$broadcast('BreweryMap.selected', brewery);
                }

                function searchHandler(evt) {
                    var text = evt.searchText.trim();
                    if (LocationParserService.isState(text.trim())) {
                        BreweryService.fetchBreweries({
                            region : text.trim()
                        });
                    } else {
                        LocationService.lookup(text);
                    }
                }
            }];
    }
}());

///*global $:false, angular:false, console:false */
//(function () {
//    'use strict';
//    angular.module('beerApp.controllers.BreweryMapController', ['ngRoute']).
//        controller('BreweryMapController', ctrl());
//
//    function ctrl() {
//        var map = null;
//        return [
//            '$scope',
//            '$http',
//            '$rootScope',
//            'BreweryService',
//            'LocationService',
//            'MapService',
//            function ($scope, $http, $rootScope, BreweryService, LocationService, MapService) {
//
//                // Handle brewery list selection
//                $scope.$on('BreweryListController.selected', function (event, brewery) {
//                    if (map) {
//                        $scope.brewery = brewery;
//                        map.selectMarker(brewery.latitude, brewery.longitude);
//                    }
//                });
//
//                $rootScope.$on('BreweryService.breweries', function (event, result) {
//                    renderMap(result)
//                });
//
//
//                // Fetch nearby breweries and render using Google maps
//                if (!LocationService.location()) {
//                    LocationService.query().then(function (r) {
////                      r = { city_override : 'San Jose' };
//                        r.local = true;
//                        fetchLocalBreweries(r, renderMap)
//                    });
//                }
//
//                /**
//                 * Find breweries near a given location
//                 * @param loc The location
//                 * @param callback The callback function to invoke after fetching breweries
//                 * @param force Force a server query
//                 */
//                function fetchLocalBreweries(loc, callback, force) {
//                    if (!BreweryService.breweries() || force) {
//                        BreweryService.fetchBreweries(loc);
//                    } else {
//                        callback(BreweryService.items);
//                    }
//                }
//
//                /**
//                 * Displays breweries on Google Maps
//                 * @param r The BreweryDB /breweries response object
//                 */
//                function renderMap(r) {
//                    if (!map) {
//                        map = MapService.map(document.getElementById('map-canvas'));
//                        map.init(searchHandler);
//                    } else {
//                        map.clearMarkers();
//                    }
//                    $.each(r.data, function (i, brewery) {
//                        map.addMarker(brewery.latitude, brewery.longitude, content(brewery), brewery, clickHandler);
//                    });
//                    map.fitBounds();
//                }
//
//                function content(brewery) {
//                    return '<div class="mapInfoContainer">' +
//                        '<a href="' + brewery.brewery.website + '" target="_blank">' +
//                        brewery.brewery.name + '</a></div>';
//                }
//
//                function clickHandler(brewery) {
//                    $rootScope.$broadcast('BreweryMap.selected', brewery);
//                }
//
//                function searchHandler(evt) {
//                    var loc = {
//                        city: evt.searchText // region: for state
//                    };
//                    fetchLocalBreweries(loc, renderMap, true);
//                }
//            }];
//    }
//}());
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.QuestionController', ['ngRoute']).
        controller('QuestionController', ctrl());

    function ctrl() {
        return ['$scope', 'QaapiService', function ($scope, QaapiService) {
            $scope.text = '';
            $scope.ask = function (text) {
                var question = {
                    "question": {
                        "evidenceRequest": {
                            "items": 5
                        },
                        "formattedAnswer": true,
                        "questionText": text
                    }
                };

                // Invoke the qaapi service and show progress
                $scope.isLoading = true;
                QaapiService.query(question).then(function (r) {
                    $scope.isLoading = false;
                });
            }
        }];
    }
}());
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.TweetController', ['ngRoute']).
        controller('TweetController', ctrl());

    function ctrl() {
        return ['$scope', 'TweetService', function ($scope, TweetService) {

            // Handle available tweets
            $scope.$on('TweetService.tweets', function (event, tweets) {
                $scope.tweets = tweets;
            });

            // Handle brewery map selection
            $scope.$on('BreweryMap.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            // Handle brewery list selection
            $scope.$on('BreweryListController.selected', function (event, brewery) {
                handleSelect(brewery);
            });

            function handleSelect(brewery) {
                TweetService.query(brewery.brewery.name);
            }
        }];
    }
}());
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.UserModelBuilderController', ['ngRoute']).
        controller('UserModelBuilderController', ctrl());

    function ctrl() {
        return ['$scope', 'UserModelingService', 'UmService', function ($scope, UserModelingService, UmService) {
            $scope.build = function () {
                if (!$scope.$parent.tweets) {
                    console.log('no profile data');
                    return;
                }

                // Convert tweets to a format compatible for
                // the user modeling service
                var profileData = UmService.
                    tweetsToProfileData($scope.$parent.tweets);

                // Invoke user modeling service
                UserModelingService.profile(profileData);
            }
        }];
    }
}());
/*global $:false, angular:false, console:false */
(function () {
    'use strict';
    angular.module('beerApp.controllers.UserModelResultController', ['ngRoute']).
        controller('UserModelResultController', ctrl());

    function ctrl() {
        return ['$scope', '$sce', 'UserModelingService', 'UmService', function ($scope, $sce, UserModelingService, UmService) {
            $scope.$on('UserModelingService.visualization', function (event, visualization) {
                $scope.visualization = $sce.trustAsHtml(visualization);
            });

            $scope.$on('UserModelingService.profile', function (event, analysis) {
                if (analysis.error_code) {
                    $scope.error = analysis.user_message;
                    return;
                }
                // TODO Traits can be filtered, however /visualize endpoint
                // To keep only traits returned by traits()
                // Uncomment the following line and replace all values 'analysis' with 'filteredAnalysis'
                // var filteredAnalysis = UmService.filterTraits(analysis,traits());
                $scope.analysis = analysis;

                $scope.error = undefined;
                $scope.analysisFlat = (UmService.flatten(analysis.tree));
                $scope.analysisKeys = Object.keys($scope.analysisFlat);

                UserModelingService.visualize(analysis);
            });
        }];

        function traits() {
            return ['Extraversion', 'Openness', 'Excitement', 'Friendliness',
                'Love', 'Anger', 'Cheerfulness'];
        }
    }
}());
/*global $:false, angular:false */
(function () {
    'use strict';

    angular.module('beerApp.directives.slick', [])
        .directive('slick', direct());

    function direct() {
        return ['$timeout', function ($timeout) {
            return {
                restrict: 'AEC',
                scope: {
                    initOnload: '@',
                    data: '=',
                    currentIndex: '=',
                    accessibility: '@',
                    arrows: '@',
                    autoplay: '@',
                    autoplaySpeed: '@',
                    centerMode: '@',
                    centerPadding: '@',
                    cssEase: '@',
                    dots: '@',
                    draggable: '@',
                    easing: '@',
                    fade: '@',
                    infinite: '@',
                    lazyLoad: '@',
                    onBeforeChange: '@',
                    onAfterChange: '@',
                    onInit: '@',
                    onReInit: '@',
                    pauseOnHover: '@',
                    responsive: '&',
                    slide: '@',
                    slidesToShow: '@',
                    slidesToScroll: '@',
                    speed: '@',
                    swipe: '@',
                    touchMove: '@',
                    touchThreshold: '@',
                    vertical: '@'
                },
                link: function (scope, element, attrs) {
                    var initializeSlick, isInitialized;
                    initializeSlick = function () {
                        return $timeout(function () {
                            var currentIndex, slider;
                            slider = $(element);
                            if (scope.currentIndex != null) {
                                currentIndex = scope.currentIndex;
                            }
                            slider.slick({
                                accessibility: scope.accessibility !== 'false',
                                arrows: scope.arrows !== 'false',
                                autoplay: scope.autoplay === 'true',
                                autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
                                centerMode: scope.centerMode === 'true',
                                centerPadding: scope.centerPadding || '50px',
                                cssEase: scope.cssEase || 'ease',
                                dots: scope.dots === 'true',
                                draggable: scope.draggable !== 'false',
                                easing: scope.easing || 'linear',
                                fade: scope.fade === 'true',
                                infinite: scope.infinite !== 'false',
                                lazyLoad: scope.lazyLoad || 'ondemand',
                                onBeforeChange: scope.onBeforeChange || null,
                                onAfterChange: function (sl, index) {
                                    if (scope.onAfterChange) {
                                        scope.onAfterChange();
                                    }
                                    if (currentIndex != null) {
                                        return scope.$apply(function () {
                                            currentIndex = index;
                                            return scope.currentIndex = index;
                                        });
                                    }
                                },
                                onInit: function (sl) {
                                    if (scope.onInit) {
                                        scope.onInit();
                                    }
                                    if (currentIndex != null) {
                                        return sl.slideHandler(currentIndex);
                                    }
                                },
                                onReInit: scope.onReInit || null,
                                pauseOnHover: scope.pauseOnHover !== 'false',
                                responsive: scope.responsive() || null,
                                slide: scope.slide || 'div',
                                slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
                                slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
                                speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
                                swipe: scope.swipe !== 'false',
                                touchMove: scope.touchMove !== 'false',
                                touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
                                vertical: scope.vertical === 'true'
                            });
                            return scope.$watch('currentIndex', function (newVal, oldVal) {
                                if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                                    return slider.slickGoTo(newVal);
                                }
                            });
                        });
                    };
                    if (scope.initOnload) {
                        isInitialized = false;
                        return scope.$watch('data', function (newVal, oldVal) {
                            if (newVal != null && !isInitialized) {
                                initializeSlick();
                                return isInitialized = true;
                            }
                        });
                    } else {
                        return initializeSlick();
                    }
                }
            };
        }
        ];
    }
}());/*global $:false, angular:false */
(function () {
    'use strict';

    angular.module('beerApp.directives.ladda', [])
        .directive('ladda', direct);

   function direct() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var ladda = Ladda.create(element[0]);
                scope.$watch(attrs.ladda, function (val) {
                    if (val) {
                        if (!ladda.isLoading()) {
                            ladda.start();
                        }
                    } else if (ladda.isLoading()) {
                        ladda.stop();
                    }
                });
            }
        };
    };
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.BreweryService', [])
        .factory('BreweryService', service());

    function service() {
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;
            return {
                fetchBreweries: fetchBreweries,
                fetchBeers: fetchBeers,
                breweries: breweries,
                notify : notify
            };

            function fetchBeers(breweryId) {
                var request = $http({
                    method: "get",
                    url: '/brewery/' + breweryId + '/beers'
                });
                return request.then(handleSuccess('BreweryService.brewery.beers'), handleError);
            }

            function fetchBreweries(loc) {
                var params = {};
                var ll = loc.loc && loc.loc.split(',');
                if (ll && ll.length == 2) {
                    params.lat = ll[0];
                    params.lng = ll[1];
                    var request = $http({
                        method: "get",
                        url: '/breweries/nearby',
                        params: params
                    });
                    return request.then(handleSuccess('BreweryService.breweries'), handleError);
                } else {
                    if (loc.city_override) params.locality = loc.city_override;
                    if (loc.city) params.locality = loc.city;
                    if (!loc.city && loc.region) params.region = loc.region;

                    var request = $http({
                        method: "get",
                        url: '/breweries',
                        params: params
                    });
                    return request.then(handleSuccess('BreweryService.breweries'), handleError);
                }
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(topic) {
                return function (response) {
                    res = response.data;
                    $rootScope.$broadcast(topic, res);
                    return res;
                }
            }

            function notify() {
                $rootScope.$broadcast('BreweryService.breweries', breweries());
            }

            /**
             * Return any previously fetched breweries
             * @returns {*}
             */
            function breweries() {
                return res;
            }

        }];
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.LocationService', [])
        .factory('LocationService', service());

    function service() {
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;

            return {
                location: location,
                locate: query,
                lookup : lookup
            };

            function lookup(address) {
                var geocoder = new google.maps.Geocoder();
                var latlng;
                geocoder.geocode( {
                    'address': address
                }, function(results, status) {
                    latlng = results[0].geometry.location.lat() +","+ results[0].geometry.location.lng();
                    $rootScope.$broadcast("LocationService.location", {
                        loc : latlng
                    });
                });

            }
            function query() {
                $rootScope.$broadcast("LocationService.searching");
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        $rootScope.$broadcast("LocationService.location", {
                            loc: position.coords.latitude+","+position.coords.longitude
                        });
                    }, function() {
                        var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
                        return request.then(handleSuccess, handleError);
                    });
                } else {
                    // Use Ip Address to detect location
                    // Browser doesn't support geolocation
                    var request = $http.jsonp('http://ipinfo.io?callback=JSON_CALLBACK');
                    return request.then(handleSuccess, handleError);
                }
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(response) {
                res = response.data;
                $rootScope.$broadcast("LocationService.location", res);
                return res;
            }

            function location() {
                return res;
            }
        }];
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.LocationParserService', [])
        .factory('LocationParserService', service());

    function service() {
        return [function () {
            return {
                parse: parse,
                isState : isState
            };

            function parse(ss) {
                var nums = /[0-9]/;

                ss = ss.trim();

                if (ss.match(nums)) {
                    throw Error('number found')
                }

                var cityState = []
                if (ss.indexOf(',') > -1) {
                    cityState = ss.split(',').map(function(x) {
                        return x.trim();
                    });

                    // check if state is an abbrev
                    var stateCandidate = cityState[1],
                        state = lookupStateByAbbrev[stateCandidate];

                    if (state) {
                        cityState[1] = state;
                    }
                }

                if (cityState.length === 0) {
                    var state = getState(ss);
                    if (state) {
                        cityState.push(undefined);
                        cityState.push(state);
                    } else {
                        cityState.push(ss);
                    }
                }

                return {
                    city : cityState[0],
                    region : cityState[1]
                };

            }

            function getState(s) {
                var state = lookupStateByAbbrev(s);
                if (state) {
                    return state;
                }

                var stateAbbrev = lookupAbbrevByState(s.toUpperCase());
                if (stateAbbrev) {
                    return s;
                }
                return undefined;
            }

            function isState(s) {
                var state = s.trim().toUpperCase();
                if (lookupAbbrevByState(state)) {
                    return true;
                }
                return false;
            }
            function lookupStateByAbbrev(s) {
                var abbrevToState = {
                    "AL": "Alabama",
                    "AK": "Alaska",
                    "AS": "American Samoa",
                    "AZ": "Arizona",
                    "AR": "Arkansas",
                    "CA": "California",
                    "CO": "Colorado",
                    "CT": "Connecticut",
                    "DE": "Delaware",
                    "DC": "District Of Columbia",
                    "FM": "Federated States Of Micronesia",
                    "FL": "Florida",
                    "GA": "Georgia",
                    "GU": "Guam",
                    "HI": "Hawaii",
                    "ID": "Idaho",
                    "IL": "Illinois",
                    "IN": "Indiana",
                    "IA": "Iowa",
                    "KS": "Kansas",
                    "KY": "Kentucky",
                    "LA": "Louisiana",
                    "ME": "Maine",
                    "MH": "Marshall Islands",
                    "MD": "Maryland",
                    "MA": "Massachusetts",
                    "MI": "Michigan",
                    "MN": "Minnesota",
                    "MS": "Mississippi",
                    "MO": "Missouri",
                    "MT": "Montana",
                    "NE": "Nebraska",
                    "NV": "Nevada",
                    "NH": "New Hampshire",
                    "NJ": "New Jersey",
                    "NM": "New Mexico",
                    "NY": "New York",
                    "NC": "North Carolina",
                    "ND": "North Dakota",
                    "MP": "Northern Mariana Islands",
                    "OH": "Ohio",
                    "OK": "Oklahoma",
                    "OR": "Oregon",
                    "PW": "Palau",
                    "PA": "Pennsylvania",
                    "PR": "Puerto Rico",
                    "RI": "Rhode Island",
                    "SC": "South Carolina",
                    "SD": "South Dakota",
                    "TN": "Tennessee",
                    "TX": "Texas",
                    "UT": "Utah",
                    "VT": "Vermont",
                    "VI": "Virgin Islands",
                    "VA": "Virginia",
                    "WA": "Washington",
                    "WV": "West Virginia",
                    "WI": "Wisconsin",
                    "WY": "Wyoming"
                };
                return abbrevToState[s];
            }
            function lookupAbbrevByState(s) {

                var stateToAbbrev = {
                    "ALABAMA": "AL",
                    "ALASKA": "AK",
                    "AMERICAN SAMOA": "AS",
                    "ARIZONA": "AZ",
                    "ARKANSAS": "AR",
                    "CALIFORNIA": "CA",
                    "COLORADO": "CO",
                    "CONNECTICUT": "CT",
                    "DELAWARE": "DE",
                    "DISTRICT OF COLUMBIA": "DC",
                    "FEDERATED STATES OF MICRONESIA": "FM",
                    "FLORIDA": "FL",
                    "GEORGIA": "GA",
                    "GUAM": "GU",
                    "HAWAII": "HI",
                    "IDAHO": "ID",
                    "ILLINOIS": "IL",
                    "INDIANA": "IN",
                    "IOWA": "IA",
                    "KANSAS": "KS",
                    "KENTUCKY": "KY",
                    "LOUISIANA": "LA",
                    "MAINE": "ME",
                    "MARSHALL ISLANDS": "MH",
                    "MARYLAND": "MD",
                    "MASSACHUSETTS": "MA",
                    "MICHIGAN": "MI",
                    "MINNESOTA": "MN",
                    "MISSISSIPPI": "MS",
                    "MISSOURI": "MO",
                    "MONTANA": "MT",
                    "NEBRASKA": "NE",
                    "NEVADA": "NV",
                    "NEW HAMPSHIRE": "NH",
                    "NEW JERSEY": "NJ",
                    "NEW MEXICO": "NM",
                    "NEW YORK": "NY",
                    "NORTH CAROLINA": "NC",
                    "NORTH DAKOTA": "ND",
                    "NORTHERN MARIANA ISLANDS": "MP",
                    "OHIO": "OH",
                    "OKLAHOMA": "OK",
                    "OREGON": "OR",
                    "PALAU": "PW",
                    "PENNSYLVANIA": "PA",
                    "PUERTO RICO": "PR",
                    "RHODE ISLAND": "RI",
                    "SOUTH CAROLINA": "SC",
                    "SOUTH DAKOTA": "SD",
                    "TENNESSEE": "TN",
                    "TEXAS": "TX",
                    "UTAH": "UT",
                    "VERMONT": "VT",
                    "VIRGIN ISLANDS": "VI",
                    "VIRGINIA": "VA",
                    "WASHINGTON": "WA",
                    "WEST VIRGINIA": "WV",
                    "WISCONSIN": "WI",
                    "WYOMING": "WY"
                };

                return stateToAbbrev[s];
            }
        }];
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.QaapiService', [])
        .factory('QaapiService', service());

    function service() {
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;
            return {
                query: query,
                items: items
            };

            function query(question) {
                var request = $http({
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: '/question',
                    data: question
                });
                return request.then(handleSuccess, handleError);
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(response) {
                res = response.data;
                $rootScope.$broadcast("QaapiService.answers", res);
                return res;
            }

            function items() {
                return res;
            }
        }];
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.TweetService', [])
        .factory('TweetService', service());

    function service() {
        return['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            return {
                query: query
            };

            function query(text) {
                var request = $http({
                    method: "get",
                    url: '/tweet',
                    params: {
                        q: text,
                        count: 100
                    }
                });
                return request.then(handleSuccess, handleError);
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return $q.reject("An unknown error occurred.");
                }
                return $q.reject(response.data.message);
            }

            function handleSuccess(response) {
                var res = response.data.tweets;
                $rootScope.$broadcast("TweetService.tweets", res);
                return res;
            }
        }];
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.UserModelingService', [])
        .factory('UserModelingService', service());
    function service() {
        return ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
            var res = null;
            return {
                profile: profile,
                visualize: visualize
            };

            function profile(userData) {
                var request = $http({
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: '/um/profile',
                    data: userData
                });
                return request.then(handleSuccess('UserModelingService.profile'),
                    handleError('UserModelingService.profile'));
            }

            function visualize(profileData) {
                var request = $http({
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    url: '/um/visualize',
                    data: profileData
                });
                return request.then(handleSuccess('UserModelingService.visualization'),
                    handleError('UserModelingService.visualization'));
            }

            function handleError(topic) {
                return function (response) {
                    if (!angular.isObject(response.data) || !response.data.user_message) {
                        return $q.reject("An unknown error occurred.");
                    }
                    $rootScope.$broadcast(topic, response.data);
                    return $q.reject(response.data.user_message);
                }
            }

            function handleSuccess(topic) {
                return function (response) {
                    res = response.data;
                    $rootScope.$broadcast(topic, res);
                    return res;
                }
            }
        }];
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.MapService', [])
        .factory('MapService', svc);

    function svc() {
        function map(containerDiv) {
            var markers = []; // TODO ise idToMarkerMap only
            var idToMarkerMap = {};
            var map = null;
            var infowindow = new google.maps.InfoWindow();
            return {
                init: function (searchHandler) {
                    map = new google.maps.Map(containerDiv, {
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        navigationControl: true,
                        navigationControlOptions: {
                            style: google.maps.NavigationControlStyle.SMALL
                        }
                    });

                    var sb = searchBox(map, searchHandler)[0];
                    sb.index = 1;
                    map.controls[google.maps.ControlPosition.TOP_LEFT].push(sb);

                    return map;
                },
                clearMarkers: function () {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                    markers = [];
                    idToMarkerMap = {};
                },
                addMarker: function (lat, long, content, data, clickHandler) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, long),
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', (function (marker, content) {
                        return function () {
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                        };
                    })(marker, content));

                    google.maps.event.addListener(marker, 'click', (function (data) {
                        return function () {
                            clickHandler(data);
                        };
                    })(data));

                    marker._infoContent = content;
                    markers.push(marker);
                    idToMarkerMap['_' + lat + '' + long] = marker;
                },
                fitBounds: function () {
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < markers.length; i++) {
                        bounds.extend(markers[i].position);
                    }
                    map.fitBounds(bounds);
                },
                selectMarker: function (lat, long) {
                    var marker = idToMarkerMap['_' + lat + '' + long];
                    infowindow.setContent(marker._infoContent);
                    infowindow.open(map, marker);
                }
            }
        }

        function searchBox(map, handler) {
            var container = $('<div/>').
                attr({'class': 'input-map'});
            var input = $('<input/>')
                .attr({
                    type: 'text',
                    id: 'mapInput',
                    name: 'mapInput'})
                .appendTo(container);
            var button = $('<button/>')
                .attr({
                    type: 'button',
                    id: 'mapSubmit',
                    name: 'mapSubmit',
                    'class': 'btn-sm btn-primary btn-map'})
                .text('Search').appendTo(container);

            google.maps.event.addDomListener(button[0], 'click', function (evt) {
                evt.searchText = $('#mapInput').val();
                handler(evt);
            });
            return container;
        }

        return {
            map: map
        };
    }
}());/*global angular:false */
(function () {
    'use strict';

    angular.module('beerApp.services.UmService', [])
        .factory('UmService', svc);

    function svc() {


//        function tweetsToProfileData(tweets) {
//            var incTweetText = function (text) {
//                var min = 600, newText = text;
//                while (newText.length < min) {
//                    newText += newText + ' ' + newText
//                }
//                return newText;
//            }
//            var data = [],
//                tweet,
//                res = {
//                    "contentItems": data
//                };
//            for (var i = 0; i < tweets.length; i++) {
//                tweet = tweets[i];
//                data[i] = {
//                    "contenttype": "text/plain",
//                    "sourceid": "twitter",
//                    "userid": tweet.user.screen_name,
//                    "created": new Date(tweet.created_at).getTime(),
//                    "language": "en",
//                    "content": incTweetText(tweet.text),
//                    "id": tweet.id_str
//                }
//            }
//            return res;
//        }

        function tweetsToProfileData(tweets) {
            var incTweetText = function (text) {
                var min = 400, newText = text;
                while (newText.length < min) {
                    newText += newText + ' ' + newText
                }
                return newText;
            }
            var data = [],
                tweet,
                res = {
                    "contentItems": data
                };

            for (var i = 0; i < tweets.length; i++) {
                tweet = tweets[i];
                data[i] = {
                    "contenttype": "text/plain",
                    "sourceid": "twitter",
                    "userid": 'patron',//tweet.user.screen_name,
                    "created": new Date(tweet.created_at).getTime(),
                    "language": "en",
                    "content": incTweetText(tweet.text),
                    "id": tweet.id_str
                }
            }
            return res;
        }

        function filterTraits(umdata, keeptraits) {
            var local = umdata;

            function traitExists(object) {
                if (keeptraits.indexOf(object.name) >= 0) {
                    return true;
                }
                // return false;
                return true;
            };
            var f = function (t) {
                if (t.children) {
                    for (var i = 0; i < t.children.length; i++) {
                        var element = t.children[i];
                        if (element.children) {
                            f(element);
                        } else {
                            var newtarr = t.children.filter(traitExists);
                            t.children = newtarr;
                        }
                    }
                }
            };
            f(local.tree);
            return local;
        }

        function flatten(tree) {
            var cats = {};
            var arr = [],
                f = function (t, level) {
                    if (!t) {
                        return;
                    }

                    if (level > 0 && (!t.children || level !== 2)) {
                        var obj = {};
                        obj.id = t.id;
                        obj.name = t.name;

                        if (t.children) {
                            obj.title = true;
                        }
                        if (t.percentage) {
                            obj.value = Math.floor(t.percentage * 100);// + "%";
                            arr.push(obj);
                        } else {
                            //  if (obj.name) {
                            cats[obj.id] = {
                                name : obj.name,
                                arr : []
                            };
                            //  }
                            arr = cats[obj.id].arr;
                        }
                        if (t.id != 'sbh') {
                        //    arr.push(obj);
                        }
                    }
                    if (t.children && t.id !== 'sbh') {
                        for (var i = 0; i < t.children.length; i++) {
                            f(t.children[i], level + 1);
                        }
                    }
                };
            f(tree, 0);

            var res = [
                cats['personality'],
                cats['needs'],
                cats['values']
            ];
            res.forEach(function(cat) {
                cat.arr.sort(function(a,b) {
                    if (a.value < b.value) {
                        return 1;
                    }
                    return -1;
                });
            });
            return res; //cats; //arr
        }

        return {
            tweetsToProfileData: tweetsToProfileData,
            filterTraits: filterTraits,
            flatten: flatten
        }
    }
}());
