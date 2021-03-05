const errors = require('../common/errors')
const logger = require('../common/logger')

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
  console.log(err)
  ctx.status = 500
  ctx.body = {
    message: err.message,
    stack: err.stack,
  }
}
