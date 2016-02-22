//https://dal09x-gateway.watsonplatform.net/instance/258/predeploy/WatsonExperienceManager
//  swamchan / Jn92Jj3F

//https://dal09x-gateway.watsonplatform.net/instance/258/deepqa/v1/question
var endpoint = {
    host : 'https://dal09x-gateway.watsonplatform.net', //https://watson.ihost.com',
    instance : '/instance/258/deepqa/v1/question', //'/instance/63/deepqa/v1/question',
    auth : 'Basic c3dhbWNoYW46Sm45MkpqM0Y='//Basic c3dhbWNoYW46RVFUeHBPcUk='
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
        //require("../cloudant").insertQAResponse(JSON.parse(body));

        // Send response
        res.send(body);
    });
};