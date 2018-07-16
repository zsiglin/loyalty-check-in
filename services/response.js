class ResponseService{
  static ok(ctx, response){
    ctx.body = { success: response };
  }

  static error(ctx, response){
    ctx.body = { error: response };
  }
};

module.exports = ResponseService;