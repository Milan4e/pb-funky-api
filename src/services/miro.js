const axios = require('axios')
const db = require('../database')
const miroToken = process.env.MIRO_TOKEN
const baseUrl = 'https://api.miro.com/v1'
const teamId = '3074457353058506671' // will be returned with Oauth

// Auth
const redirectUri  =  process.env['MIRO_APP_REDIRECT_URI']
const clientId     = process.env['MIRO_APP_CLIENT_ID']
const clientSecret = process.env['MIRO_APP_CLIENT_SECRET']

module.exports = {
  redirectUri,
  clientId,
  clientSecret,

  createBoard: async ({ name, description }) => {
    const board = await axios.default.post(`${baseUrl}/boards?access_token=${miroToken}`, {
      name,
      description,
      sharingPolicy: {
        access: 'comment',
        teamAccess: 'edit',
      }
    })

    return board
  },

  getBoards: async () => {
    const board = await axios.default.get(`${baseUrl}/teams/${teamId}/boards?access_token=${miroToken}`)

    return board
  },

  createWidget: async (boardId, widget) => {
    const createdWidget = await axios.default.post(`${baseUrl}/boards/${boardId}/widgets?access_token=${miroToken}`, widget)

    return createdWidget
  },

  getAllWidgets: async (boardId) => {
    const { data } = await axios.default.get(`${baseUrl}/boards/${boardId}/widgets?access_token=${miroToken}`)

    return data
  },

  getCurrentUser: async (userId) => {
    const { access_token } = await db.User.findByPk(userId)

    const { data } = await axios.default.get(`${baseUrl}/users/me?access_token=${access_token}`)

    return data
  },

  getToken: async (code) => {
    const url = `${baseUrl}/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}&`

    const { data } = await axios.default.post(url)

    return data
  },
}
