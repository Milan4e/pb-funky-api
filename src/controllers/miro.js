const compose = require('koa-compose')
const pb = require('../services/pb')
const errors = require('../common/errors')

module.exports = {
  createNote: compose([
    async ctx => {
      const data = ctx.request.body

      try {
        await pb.createNote({
          title: data.title,
          content: data.content,
          customerEmail: data.customerEmail,
        })
      } catch (err) {
        throw new errors.ApiError('Failed to create note in PB :(')
      }

      ctx.status = 201
    },
  ]),
}
