const requestVerifierService = require('../services/request-verifier');

class Controller{
    static verifyRequest({ requiredParameters, requestBody }){
        const requestVerified = new requestVerifierService({
            requiredParameters,
            requestBody
        });

        return requestVerified.verify();
    }
};

module.exports = Controller;