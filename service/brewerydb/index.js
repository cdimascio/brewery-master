var rootService = 'http://api.brewerydb.com/v2/',
    apiKey = 'af18a74e17637d102ee846d2f3b30d0f';

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
