const compose = require('koa-compose')
const logger = require('../common/logger')
const miro = require('../services/miro')
const gitlab = require('../services/gitlab')
const twitter = require('../services/twitter')
const errors = require('../common/errors')
const sib = require('../services/sib')
const gitlabProjectId = '23513011'


function randomPosition() {
  return Math.random() * 500
}

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

      const { data } = await miro.createWidget(boardId, {
        type: 'card',
        title: body.data.name,
        x: randomPosition(),
        y: randomPosition()
      })

      logger.info({ body })

      ctx.status = 200
      ctx.body = { text: 'card', url: `https://miro.com/app/board/${boardId}/?moveToWidget=${data.id}` }
    },
  ]),

  tweet: compose([
    async ctx => {
      const body = ctx.request.body

      const data = await twitter.tweet(body.data.name)

      logger.info({ data })

      ctx.status = 200
      ctx.body = { text: 'tweet', url: `https://twitter.com/Genericintegra1/status/${data.id_str}` }
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

      body.x = randomPosition()
      body.y = randomPosition()

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
      const body = ctx.request.body;

      const featureResponse = await gitlab.getFeatureFromPb(body.data.feature.links.self)

      let feature = featureResponse.data.data;

      const { data } = await gitlab.createIssue(gitlabProjectId, {
        title: feature.name,
        description: `${feature.description}`
      })

      gitlab.storeMapping(feature.id, data)

      ctx.status = 200
      ctx.body = {
        "data": {
          "connection": {
            "state": "connected",
            "label": data.state,
            "hoverLabel": `${data.iid}`,
            "tooltip": `Issue ${data.iid}`,
            "color": "blue",
            "targetUrl": `${data.web_url}`
          }
        }
      }
    },
  ]),

  validate: compose([
    async ctx => {
      const token = ctx.request.query.validationToken

      ctx.status = 200
      ctx.body = token
    },
  ]),

  updateGitlabIssue: compose([
    async ctx => {
      const webhook = ctx.request.body

      const feature = await gitlab.getFeatureFromPb(webhook.links.target)

      await gitlab.updateIssue(gitlabProjectId, feature.id, feature.name)

      ctx.status = 200
      ctx.body = {}
    }
  ]),

  processGitlabWebhook: compose([
    async ctx => {
      const attributes = ctx.request.body.object_attributes

      await gitlab.notifyPb(attributes.id, attributes.iid, attributes.url, attributes.state)

      ctx.status = 200
      ctx.body = {}
    }
  ]),


  createSibList: compose([
    async ctx => {
      logger.info({ body: ctx.request.body })

      const listName = ctx.request.body.data.name

      let list

      try {
        list = await sib.createList(listName)
      } catch (err) {
        ctx.body = err.response.data
        ctx.status = 400
        return
      }

      ctx.status = 200
      ctx.body = { text: listName, url: `https://my.sendinblue.com/users/list/id/${list.id}` }
    }
  ]),

  createSibEmailCampaign: compose([
    async ctx => {
      logger.info({ body: ctx.request.body })

      const campaignName = ctx.request.body.data.name

      let campaign

      try {
        campaign = await sib.createEmailCampaign(campaignName)
      } catch (err) {
        logger.info(err)
        ctx.body = err.response.data
        ctx.status = 400
        return
      }

      ctx.status = 200
      ctx.body = { text: campaignName, url: `https://my.sendinblue.com/camp/classic/${campaign.id}/confirmation` }
    }
  ])
}
