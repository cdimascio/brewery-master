/*global angular:false */
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
}());