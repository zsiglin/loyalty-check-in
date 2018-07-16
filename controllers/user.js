const Controller = require('./index');
const NEW_USER_CHECK_IN_POINTS = 50;

// models
const User = require('../models/user');
const CheckIn = require('../models/check-in');

// services
const responseService = require('../services/response');
const emailService = require('../services/email');

class UserController extends Controller{
  // post : /users/create
  static async create(ctx){
    const request = super.verifyRequest({
      requiredParameters: ['firstName', 'lastName', 'phoneNumber', 'emailAddress'],
      requestBody: ctx.request.body 
    });

    const { firstName, lastName, phoneNumber, emailAddress } = request.parameterValues;
    const missingParameters = request.missingParameters;

    const allParametersPresent = missingParameters.length === 0;
    
    if(allParametersPresent){
        const userId = await (new User).save({
          firstName, 
          lastName,
          phoneNumber,
          emailAddress
        });

        await (new CheckIn).save({
          userId,
          points: NEW_USER_CHECK_IN_POINTS
        });

        const userCheckInData = await CheckIn.getUserCheckInData(userId);

        const responseData = { 
          newPointsEarned: NEW_USER_CHECK_IN_POINTS,
          ...userCheckInData
        };

        const email = await new emailService({
          recipient: emailAddress, 
          ...responseData,
        }).sendPointTotal();
        
        responseService.ok(ctx, responseData);
    } else {
      return responseService.error(ctx, `Missing parameter(s): ${missingParameters.join(', ')}`);
    }
  }
};

module.exports = UserController;