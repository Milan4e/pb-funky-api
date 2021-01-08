const Router = require('koa-router')
const controllers = require('../controllers')

const router = new Router({ prefix: '/api/feature' })

router.get('/', controllers.feature.getAll)
router.post('/', controllers.feature.create)
router.post('/boards', controllers.feature.createBoard)
router.post('/boards/:id/widgets', controllers.feature.createWidget)
router.get('/boards/:id/widgets', controllers.feature.getAllWidgets)
router.get('/boards', controllers.feature.getBoards)

// GitLab
router.post('/gitlab', controllers.feature.createGitlabIssue)
router.post('/gitlab/webhook', controllers.feature.processGitlabWebhook)

// Send in blue
router.post('/sib/list', controllers.feature.createSibList)

module.exports = router
