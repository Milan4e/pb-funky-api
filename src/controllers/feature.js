const compose = require('koa-compose')
const logger = require('../common/logger')

module.exports = {
  getOne: compose([
    async ctx => {

      ctx.status = 200
      ctx.body = {}
    },
  ]),

  getAll: compose([
    async ctx => {
      ctx.status = 200
      ctx.body = {}
    },
  ]),

  create: compose([
    async ctx => {
      const body = ctx.request.body

      logger.info({ body })

      ctx.status = 200
      ctx.body = {}
    },
  ]),
}
