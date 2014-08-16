var endpoint = {
    host : 'https://watson.ihost.com',
    instance : '/instance/8/deepqa/v1/question',
    auth : 'Basic dHJpZGVudDh1c2VyMTpzaGFkNzRyYWNr'
};

exports.question = function(req, res) {
    require("request")({
        'uri' : endpoint.host + endpoint.instance,
        'method' : "POST",
        'headers' : {
            'Content-Type' : 'application/json',
            'X-SyncTimeout' : '30',
            'Authorization' : endpoint.auth
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        'json' : req.body
    }, function(error, response, body) {
        res.json(body);
    });
};