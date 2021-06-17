const axios = require('axios')
const miroToken = process.env.MIRO_TOKEN
const baseUrl = 'https://api.miro.com/v1'
const teamId = '3074457353058506671' // will be returned with Oauth

// Auth
// TODO: move to env variable
const host = process.env['HOST']
const redirectUrl =  `${host}/oauth/install`

// Should be stored somehow secured :)
const clientId = '3074457360290041502'
const clientSecret = 'BKQW61r0zpbuKnliYcSCwptdC3U7oVEc'

// FIXME: use real DB
const users_to_tokens = {}

module.exports = {
  redirectUrl,
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
    const token = users_to_tokens[userId]

    const { data } = await axios.default.get(`${baseUrl}/users/me?access_token=${token}`)

    return data
  },

  getToken: async (code) => {
    const url = `${baseUrl}/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&client_id=${clientId}&client_secret=${clientSecret}&`

    const { data } = await axios.default.post(url)

    return data
  },

  store: function (userId, token) {
    users_to_tokens[userId] = token

    console.log("token storage", users_to_tokens)
  },
}
