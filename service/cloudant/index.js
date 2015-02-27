var beerDbBaseUrl = "https://9797d8a3-0b19-4b5a-a9eb-109b37822857-bluemix:feb7eb550d664139e77de7b1b378aff6eaaf0385b1864d7fca06e1938baaf234@9797d8a3-0b19-4b5a-a9eb-109b37822857-bluemix.cloudant.com/beer";

//"https://9797d8a3-0b19-4b5a-a9eb-109b37822857-bluemix.cloudant.com/beer"

exports.insertQAResponse = function(qaResponse) {
    require("request")({
        uri : beerDbBaseUrl,
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        json : qaResponse //JSON.stringify(qaResponse)
    }, function(error, response, body) {
        if (response.statusCode != 200 || response.statucCode != 201) {
            console.error("Failed to insert question/answers");
        }
    });
};


// TODO Misc random stuff - dumped it here for now
// Move it

exports.getAllQuestions = function(req, res) {
    var questionsQuery = {
        "selector" : {
            "_id": {"$gt": null}, "question" : {"$exists" : true}
        },
        "fields": [
            "question.questionText"
        ]
    };

    if (req.query.answers) {
        questionsQuery.fields.push('question.answers');
    }
    if (req.query.evidence) {
        questionsQuery.fields.push('question.evidencelist');
    }
    require("request")({
        uri : beerDbBaseUrl+"/_find",
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        json : questionsQuery,
    }, function(error, response, body) {
        res.send(body);
    });
};