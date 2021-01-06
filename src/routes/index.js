const KoaRouter = require('koa-router')

const router = new KoaRouter()
const feature = require('./feature')

router.get('/', ctx => {
  ctx.status = 200
  ctx.body = {
    appName: 'Funky API',
    status: 'ok'
  }
})

router.use(feature.routes())

module.exports = router.routes()
