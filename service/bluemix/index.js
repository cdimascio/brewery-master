/**
 * Returns credentials for the Watson User Modeling service
 * @returns {*}
 */
exports.userModeling = function() {
    // TODO return the credentials object for the user modeling service
    return vcapServices()["personality_insights"][0].credentials;
}

// TODO REMOVE EVERYTHING BELOW FOR CLASS
/**
 * Return the VCAP_SERVICES environment variable
 * as a JSON object
 * @returns {*}
 */
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
    "personality_insights": [
        {
            "name": "Brewery_Personality_Insights",
            "label": "personality_insights",
            "plan": "IBM Watson Personality Insights Monthly Plan",
            "credentials": {
                "url": "https://gateway.watsonplatform.net/personality-insights/api",
                "username": "68b028d8-095b-4580-a646-9ea2faa07083",
                "password": "xSEu53ojoDis"
            }
        }
    ]
};

