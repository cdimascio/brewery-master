// Read in UserModeling service environment
var userModelingEnv = require('../bluemix').userModeling();

exports.analyze = function(req, res) {
    require('request')({
        'uri' : userModelingEnv.api_url + 'api/v2/profile',
        'method' : "POST",
        'headers' : {
            'Content-Type' : 'application/json',
            'Content-Length': JSON.stringify(req.body).length
        },
        auth : {
            user : userModelingEnv.username,
            pass : userModelingEnv.password,
            sendImmediately: false
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        json : req.body
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        }
        res.send(body);
    });
}

exports.visualize = function(req, res) {
    require('request')({
        'uri' : userModelingEnv.api_url + 'api/v2/visualize',
        'method' : "POST",
        'headers' : {
            'Content-Type' : 'application/json',
            'Content-Length': JSON.stringify(req.body).length
        },
        auth : {
            user : userModelingEnv.username,
            pass : userModelingEnv.password,
            sendImmediately: false
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        body : JSON.stringify(req.body)
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        }
        res.send(body);
    });
}
