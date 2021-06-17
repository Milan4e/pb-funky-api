const compose = require('koa-compose')
// const logger = require('../common/logger')
const miro = require('../services/miro')
// const errors = require('../common/errors')

module.exports = {
  index: compose([
    async ctx => {
      ctx.status = 200
      ctx.body = `
        <html>
          <head></head>
          <body>
            <form action="/oauth/init" method="post">
              <label for="token">Public API Token:</label><input type="text" name="token" id="token" /><br/>
              <input type="submit">
            </form>
          </body>
        </html>
      `
    }
  ]),

  init: compose([
    async ctx => {
      const token = ctx.request.body.token
      const state = JSON.stringify({ token })

      const url = `https://miro.com/oauth/authorize?response_type=code&client_id=${miro.clientId}&redirect_uri=${miro.redirectUrl}&state=${state}`
      ctx.redirect(url)
    }
  ]),

  install: compose([
    async ctx => {
      let token;
      const { code, state } = ctx.query

      if (code) {
        // TODO: store following into database
        const { access_token, user_id, team_id } = await miro.getToken(ctx.query.code)

        if (state) {
          // Auth flow initiated from our service with a public api token
          // TODO: store the JWT
          parsedState = JSON.parse(state)
          token = parsedState.token

          console.log(`Received access_token '${access_token}' for token=${token}`)

          ctx.status = 200
          ctx.body = `Miro successfully authorized`
        } else {
          // Auth flow from Miro app itself. Will miss the API token
          // NOTE: just for debugging, practically harder to use because of missing token
          console.log(`Received access_token '${access_token}'`)

          ctx.redirect(`https://miro.com/app-install-completed/?client_id=${ctx.query.client_id}&team_id=${ctx.query.team_id}`)
        }
      } else {
        throw "Missing code query param"
      }
    }
  ])
}
