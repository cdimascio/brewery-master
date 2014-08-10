
//breweries near vegas
//http://api.brewerydb.com/v2/locations?key=af18a74e17637d102ee846d2f3b30d0f&locality=Las%20Vegas

// r.totalResults
// r.data[0].
   // latitude
   // longitude
   // brewery.name
   // brewery.description
   // brewery.website
   // brewery.established
   // brewer.images.icon/medium/large
var rootService = 'http://api.brewerydb.com/v2/',
    apiKey = 'af18a74e17637d102ee846d2f3b30d0f'; // add to BM env

exports.breweries = function(req, res) {
    var request = require('request'),
        locality = req.query.locality,
        region = req.query.region,
        uri = rootService+'locations?key='+apiKey;

    uri += '&'+require('url').parse(req.url).query;
    console.log(uri);
/*
    uri += (locality) ? '&locality='+encodeURIComponent(locality) : '';
    uri += (region) ? '&region='+encodeURIComponent(region) : '';
*/

    request({
        'uri' : uri,
        'method' : "GET",
        'headers' : {
            'Content-Type' : 'application/json'
        }
    }, function(error, response, body) {
        res.send(body);
    });
};
