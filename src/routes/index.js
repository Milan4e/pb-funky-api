const KoaRouter = require('koa-router')

const router = new KoaRouter()
const feature = require('./miro')
const miroAuth = require('./miroAuth')

router.get('/', ctx => {
  ctx.redirect('/oauth')
})

router.use(feature.routes())
router.use(miroAuth.routes())

module.exports = router.routes()
