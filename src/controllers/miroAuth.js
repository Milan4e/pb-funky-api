const compose = require('koa-compose')
// const logger = require('../common/logger')
const miro = require('../services/miro')
// const errors = require('../common/errors')

module.exports = {
  install: compose([
    async ctx => {
      const { code } = ctx.query

      if (code) {
        const { access_token, user_id, team_id } = await miro.getToken(ctx.query.code)

        // TODO: store the values above into database
        console.log(`Received access_token '${access_token}'`)

        ctx.redirect(`https://miro.com/app-install-completed/?client_id=${ctx.query.client_id}&team_id=${ctx.query.team_id}`)
      } else {
        throw "Missing code query param"
      }
    }
  ])
}
