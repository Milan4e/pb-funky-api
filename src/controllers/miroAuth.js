const compose = require('koa-compose')
const db = require('../database')
// const logger = require('../common/logger')
const miro = require('../services/miro')
// const errors = require('../common/errors')

module.exports = {
  index: compose([
    async ctx => {
      ctx.status = 200
      ctx.body = `
        <html>
          <head>
              <link rel="stylesheet" href="/public/styles.css">
          </head>
          <body class="auth-page">
              <h1>
                  <img width="30" src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/pslfwcfyxsh2lwmmtkvz">
                  Install Miro integration
              </h1>

              <p>
                  First you need to authorize Miro application for your Miro team.
              </p>

              <p>
                  This step requires a Productboard Public API token.
                  To generate one follow steps on our <a href="https://developer.productboard.com/#section/Authentication/Getting-a-token" target="_blank">developer portal</a>
              </p>

              <form action="/oauth/init" method="post" id="form" autocomplete="off">
                  <div class="form-group field-title">
                      <textarea type="text" name="token" id="token" class="form-input token" placeholder="Productboard public API token" required></textarea><br/>
                  </div>
                  <button type="submit" name="submit" id="submit" >Continue</button>
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

      const url = `https://miro.com/oauth/authorize?response_type=code&client_id=${miro.clientId}&redirect_uri=${miro.redirectUri}&state=${state}`
      ctx.redirect(url)
    }
  ]),

  install: compose([
    async ctx => {
      let token;
      const { code, state } = ctx.query

      if (!code) {
        throw "Missing code"
      }

      const { access_token, user_id, team_id } = await miro.getToken(ctx.query.code)

      if (state) {
        parsedState = JSON.parse(state)
        token = parsedState.token

        const exists = await db.User.findOne({
          attributes: ['id'],
          where: { user_id, team_id },
        })

        if (exists) {
          await db.User.update({ access_token, token }, { where: { user_id, team_id } })
        } else {
          await db.User.create({
            access_token,
            user_id,
            token,
            team_id,
          })
        }

        if (parsedState.source == 'miro') {
          ctx.redirect(`https://miro.com/app-install-completed/?client_id=${ctx.query.client_id}&team_id=${ctx.query.team_id}`)
        } else {
          ctx.status = 200
          ctx.body = `Miro successfully authorized for your team`
        }
      }
    }
  ])
}
