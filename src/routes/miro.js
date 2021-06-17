const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/api/miro' })

router.post('/note', controllers.miro.createNote)

module.exports = router
