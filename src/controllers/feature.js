const compose = require('koa-compose')

module.exports = {
  getOne: compose([
    async ctx => {

      ctx.status = 200
      ctx.body = industry
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

      console.log(body)

      ctx.status = 200
      ctx.body = {}
    },
  ]),
}
