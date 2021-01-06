const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/api/feature' })

router.get('/', controllers.feature.getAll)
router.post('/', controllers.feature.create)

module.exports = router
