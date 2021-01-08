const compose = require('koa-compose')
const logger = require('../common/logger')
const miro = require('../services/miro')
const gitlab = require('../services/gitlab')
const errors = require('../common/errors')

module.exports = {
  getOne: compose([
    async ctx => {

      ctx.status = 200
      ctx.body = {}
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
      const boardId = 'o9J_lZ6I-ys='
      //   {
      //     "data": {
      //         "id": "1d1ce8f8-7cdd-42c7-b2cd-4b4df9d8741e",
      //         "name": "Archive a ticket",
      //         "description": "Smoke test description 2021-01-05T13:34:25.507521Z",
      //         "type": "subfeature",
      //         "status": {
      //             "id": 180915,
      //             "name": "In progress"
      //         }
      //     }
      //   }

      const body = ctx.request.body

      body.x = Math.random() * 500
      body.y = Math.random() * 500

      const { data } = await miro.createWidget(boardId, { type: 'card', title: body.data.name })

      logger.info({ body })

      ctx.status = 200
      ctx.body = { text: 'card', url: `https://miro.com/app/board/${boardId}/?moveToWidget=${data.id}` }
    },
  ]),

  createBoard: compose([
    async ctx => {
      const body = ctx.request.body
      logger.info({ body })

      let board

      try {
        const { data } = await miro.createBoard(body)

        board = data
      } catch (err) {
        logger.error({ err }, 'Oops')
        throw new errors.ApiError('Failed to create board', 500)
      }

      ctx.status = 200
      ctx.body = board
    },
  ]),

  getBoards: compose([
    async ctx => {
      let boards

      try {
        const { data } = await miro.getBoards()

        boards = data
      } catch (err) {
        ctx.status = err.response.status
        ctx.body = err.response.data
        return
      }

      ctx.status = 200
      ctx.body = { boards }
    },
  ]),

  createWidget: compose([
    async ctx => {
      const body = ctx.request.body
      const boardId = ctx.params.id

      body.x = Math.random() * 500
      body.y = Math.random() * 500

      let widget

      try {
        const { data } = await miro.createWidget(boardId, body)

        widget = data
      } catch (err) {
        ctx.status = err.response.status
        ctx.body = err.response.data
        return
      }

      ctx.status = 200
      ctx.body = widget
    },
  ]),

  getAllWidgets: compose([
    async ctx => {
      const boardId = ctx.params.id

      let widgets

      try {
        const { data } = await miro.getAllWidgets(boardId)

        widgets = data
      } catch (err) {
        ctx.status = err.response.status
        ctx.body = err.response.data
        return
      }

      ctx.status = 200
      ctx.body = widgets
    },
  ]),

  createGitlabIssue: compose([
    async ctx => {
      const projectId = '23513011'

      const body = ctx.request.body
      const feature = body.data

      const { data } = await gitlab.createIssue(projectId, {
        title: feature.name,
        description: feature.description
      })

      logger.info({ body })

      gitlab.storeMapping(feature.id, data.id)

      ctx.status = 200
      ctx.body = { text: `Issue ${data.iid}`, url: `${data.web_url}` }
    },
  ]),

  processGitlabWebhook: compose([
    async ctx => {
      const attributes = ctx.request.body.object_attributes

      logger.info({ attributes })

      await gitlab.notifyPb(attributes.id, attributes.iid, attributes.url, attributes.state)

      ctx.status = 200
      ctx.body = {}
    }
  ])
}
