exports.userModeling = function() {
    return vcapServices()["systemudemoapisl-staging"][0].credentials;
}

exports.qaApi = function () {
    return vcapServices()["Watson QAAPI-0.1"][0].credentials;
}

exports.machineTranslation = function () {
    return vcapServices()["smt"][0].credentials;
}

function vcapServices() {
    var vcapServices = parseVcapServices();
    if (!vcapServices) {
        console.log('Warning VCAP_SERVICES NOT_FOUND, Using test environment');
        return testEnvironment;
    }

    console.log('Using VCAP_SERVICES environment');
    return vcapServices;
}

function parseVcapServices() {
    return process && process.env &&
        process.env.VCAP_SERVICES &&
        JSON.parse(process.env.VCAP_SERVICES);
}

var testEnvironment = {
    "Watson QAAPI-0.1": [
        {
            "name": "Question and Answer-cmd",
            "label": "Watson QAAPI-0.1",
            "plan": "Free",
            "credentials": {
                "url": "https://75.126.153.244/instance/w4itsl/deployPipeline/deepqa/v1/question",
                "userid": "demouser1",
                "password": "pact14wat1"
            }
        }
    ],
    "smt": [
        {
            "name": "Machine Translation-cmd",
            "label": "smt",
            "plan": "free",
            "credentials": {
                "uri": "http://23.246.192.180/laser/v1/smt/1e476421511745d3b91d94bf5dcecae5",
                "userid": "woyvqtkz",
                "password": "n9s2Qduh",
                "sids": [
                    {
                        "sid": "mt-enus-eses",
                        "description": "translation from English to Spanish"
                    },
                    {
                        "sid": "mt-eses-enus",
                        "description": "translation from Spanish to English"
                    }
                ]
            }
        }
    ],
    "systemudemoapisl-staging": [
        {
            "name": "User Modeling-ht",
            "label": "systemudemoapisl-staging",
            "plan": "systemudemo_plan_free",
            "credentials": {
                "api_url": "https://service-s.platform.watson.ibm.com/systemu/service/",
                "username": "4a311ebf-4da3-4c08-8d1b-e3032acc024a",
                "password": "l8AJwDVluNxM"
            }
        }
    ]
};


/*

{
    "systemudemoapisl": [
    {
        "name": "User Modeling-ws",
        "label": "systemudemoapisl",
        "plan": "systemudemo_plan_free",
        "credentials": {
            "api_url": "http://23.246.192.162:9080/systemu",
            "username": "cae8dde5-a306-43c3-90e6-085da01022b3",
            "password": "UchbmkHHCEa1"
        }
    }
]
}*/