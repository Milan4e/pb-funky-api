const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/api/feature' })

router.get('/', controllers.feature.getAll)
router.post('/', controllers.feature.create)
router.post('/boards', controllers.feature.createBoard)
router.post('/boards/:id/widget', controllers.feature.createWidget)
router.get('/boards', controllers.feature.getBoards)

module.exports = router
