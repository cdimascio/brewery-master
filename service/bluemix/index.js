/**
 * Returns credentials for the Watson User Modeling service
 * @returns {*}
 */
exports.userModeling = function() {
    // TODO return the credentials object for the user modeling service
    return vcapServices()["user_modeling"][0].credentials;
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
    "user_modeling": [
        {
            "name": "bm-User Modeling",
            "label": "user_modeling",
            "plan": "user_modeling_free_plan",
            "credentials": {
                "url": "https://gateway.watsonplatform.net/systemu/service/",
                "username": "84f594d4-cf3b-41d4-aa6b-32f67b34a341",
                "password": "vpFicDdgGzg8"
            }
        }
    ]
};

