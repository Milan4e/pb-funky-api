const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/api/miro' })

router.get('/', controllers.miro.getAll)

module.exports = router
