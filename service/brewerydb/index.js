var rootService = 'http://api.brewerydb.com/v2/',
    p = require('../util').brewerydb();

exports.breweryBeers = function(req, res) {
    var uri = rootService+'brewery/'+req.params.id+'/beers?'+p+
        '&'+require('url').parse(req.url).query;
    require('request')({
        uri : uri,
        method : "GET",
        headers : {
            'Content-Type' : 'application/json'
        }
    }, function(error, response, body) {
        res.send(body);
    });
}

exports.breweries = function(req, res) {
    var uri = rootService+'locations?'+p+
        '&'+require('url').parse(req.url).query;
    require('request')({
        uri : uri,
        method : "GET",
        headers : {
            'Content-Type' : 'application/json'
        }
    }, function(error, response, body) {
        res.send(body);
    });
};
