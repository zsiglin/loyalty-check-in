const Router = require('koa-router');
const UserController = require('../controllers/user');
const CheckInController = require('../controllers/check-in');

/**
 * users routing
 */
const userRouter = new Router({ 
  prefix: '/users' 
});

userRouter.post('/create', UserController.create);

/**
 * check-in routing
 */
userRouter.post('/check-in/create', CheckInController.create);

module.exports = (app) => {
  app.use(userRouter.routes());
};