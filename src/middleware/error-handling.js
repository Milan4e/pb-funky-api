const errors = require('../common/errors')

module.exports = {
  async handleErrors(ctx, middleware) {
    try {
      await middleware()
    } catch (err) {
      processError(ctx, err)
    }
  },
}

function processError(ctx, err) {
  ctx.status = 500
  ctx.body = {
    message: err.message,
    stack: err.stack,
  }
}
