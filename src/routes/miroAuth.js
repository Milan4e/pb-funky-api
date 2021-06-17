const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/oauth' })

router.get('/install', controllers.miroAuth.install)

module.exports = router
