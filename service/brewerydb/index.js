// PLEASE DO NOT USE THESE CREDENTIALS:
// These credentials belong to dimascio@us.ibm.com
var rootService = 'http://api.brewerydb.com/v2/',
    apiKey = 'af18a74e17637d102ee846d2f3b30d0f';

exports.breweryBeers = function(req, res) {
    var uri = rootService+'brewery/'+req.params.id+'/beers?key='+apiKey+
        '&'+require('url').parse(req.url).query;
    require('request')({
        'uri' : uri,
        'method' : "GET",
        'headers' : {
            'Content-Type' : 'application/json'
        }
    }, function(error, response, body) {
        res.send(body);
    });
}

exports.breweries = function(req, res) {
    var uri = rootService+'locations?key='+apiKey+
        '&'+require('url').parse(req.url).query;
    require('request')({
        'uri' : uri,
        'method' : "GET",
        'headers' : {
            'Content-Type' : 'application/json'
        }
    }, function(error, response, body) {
        res.send(body);
    });
};
