const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/oauth' })

router.get('/', controllers.miroAuth.index)
router.post('/init', controllers.miroAuth.init)
router.get('/install', controllers.miroAuth.install)

module.exports = router
