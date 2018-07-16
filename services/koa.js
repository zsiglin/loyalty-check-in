const Koa = require('koa');

const logger = require('koa-logger');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const serveStatic = require('koa-serve-static');

const HTTP_PORT = 3000;

exports.init = () => {
  const app = new Koa();
  
  // middleware
  app.use(logger());
  app.use(json());
  app.use(bodyParser());
  require('../config/routes')(app);
  app.use(serveStatic('public', {'index': ['index.html']}));

  // start server
  app.listen(HTTP_PORT);
  console.log('Server ready on port:', HTTP_PORT);
};