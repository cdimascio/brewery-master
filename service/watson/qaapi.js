var endpoint = {
    host : 'https://watson.ihost.com',// 'https://watson.ihost.com',
    instance : '/instance/63/deepqa/v1/question',//predeploy/WatsonExperienceManager#//'/instance/8/deepqa/v1/question',
    auth : 'Basic a3hhX2F1dGhvcjE6QXNGYkN3QTE=' //'Basic dHJpZGVudDh1c2VyMTpzaGFkNzRyYWNr'
};

exports.question = function(req, res) {

    require("request")({
        uri : endpoint.host + endpoint.instance,
        method : "POST",
        headers : {
            'Content-Type' : 'application/json',
            'X-SyncTimeout' : '30',
            'Authorization' : endpoint.auth
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        body : JSON.stringify(req.body)
    }, function(error, response, body) {
        // Log to Cloudant asynchronously
        require("../cloudant").insertQAResponse(JSON.parse(body));

        // Send response
        res.send(body);
    });
};