const axios = require('axios')
const miroToken = process.env.MIRO_TOKEN
const baseUrl = 'https://api.miro.com/v1'
const teamId = '3074457353058506671' // will be returned with Oauth

module.exports = {
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
  }
}