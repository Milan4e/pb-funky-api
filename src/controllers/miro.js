const compose = require('koa-compose')
const miro = require('../services/miro')
const pb = require('../services/pb')
const errors = require('../common/errors')

module.exports = {
  createNote: compose([
    async ctx => {
      const data = ctx.request.body

      try {
        const { email } = await miro.getCurrentUser(data.userId)
        const tags = (data.tags || "").split(",").map(function (e) { return e.trim() })

        await pb.createNote({
          title: data.title,
          content: data.content,
          customer_email: email,
          display_url: data.link,
          tags: tags
        })
      } catch (err) {
        throw new errors.ApiError('Failed to create note in PB :(')
      }

      ctx.status = 201
    },
  ]),
}
