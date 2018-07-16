class RequestVerifierService{
    constructor({ requiredParameters=[], requestBody }){
        this.requiredParameters = requiredParameters;
        this.requestBody = requestBody;
    }

    getMissingParameters(){
        const missingParameters = this.requiredParameters.filter((parameter) => {
            const currentParameter = this.requestBody[parameter];
            return currentParameter ? false : true;
        });

        return missingParameters;
    }

    getParameterValues(){
        const parameterValues = {};

        this.requiredParameters.forEach((parameter) => {
            parameterValues[parameter] = this.requestBody[parameter];
        });

        return parameterValues;
    }

    verify(){
        return {
            missingParameters: this.getMissingParameters(),
            parameterValues: this.getParameterValues()
        }
    }
};

module.exports = RequestVerifierService;