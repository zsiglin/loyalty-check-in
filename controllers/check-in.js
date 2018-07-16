const Controller = require('./index');
const POINTS_PER_CHECK_IN = 20;

// models
const User = require('../models/user');
const CheckIn = require('../models/check-in');

// services
const responseService = require('../services/response');
const emailService = require('../services/email');

class CheckInController extends Controller{
  // post : /users/check-in/create
  static async create(ctx){
    const request = super.verifyRequest({
      requiredParameters: ['phoneNumber'],
      requestBody: ctx.request.body 
    });

    const { phoneNumber } = request.parameterValues;
    const missingParameters = request.missingParameters;

    const allParametersPresent = missingParameters.length === 0;
    const userFound = allParametersPresent ? await User.find({ phoneNumber }) : false;
    const canCheckIn = userFound ? await CheckIn.canCheckIn(userFound.id) : false;

    if(allParametersPresent && userFound && canCheckIn){
      await (new CheckIn).save({
        userId: userFound.id,
        points: POINTS_PER_CHECK_IN
      });

      const userCheckInData = await CheckIn.getUserCheckInData(userFound.id);

      const responseData = { 
        newPointsEarned: POINTS_PER_CHECK_IN,
        ...userCheckInData
      };

      const email = await new emailService({
        recipient: userFound.emailAddress, 
        ...responseData,
      }).sendPointTotal();

      responseService.ok(ctx, responseData);
    } else {
      if(!allParametersPresent) return responseService.error(ctx, `Missing parameter(s): ${missingParameters.join(', ')}`);
      if(!userFound) return responseService.error(ctx, 'User not found.');
      if(!canCheckIn) return responseService.error(ctx, 'You must wait at least 5 minutes between check-ins.');
    }
  }
};

module.exports = CheckInController;