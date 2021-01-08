const axios = require('axios')

const apiKey = process.env.SEND_IN_BLUE_KEY
const baseUrl = 'https://api.sendinblue.com/v3'

// https://developers.sendinblue.com/reference

module.exports = {
  createList: async ({ name }) => {
    const result = await axios.default.post(
      `${baseUrl}/contacts/lists`,
      {
        name,
        folderId: 3,
      },
      {
        headers: {
          'api-key': apiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
      },
    )

    return result.data
  },

  getAllLists: async () => {
    const { data } = await axios.default.get(
      `${baseUrl}/contacts/lists`,
      {
        headers: {
          'api-key': apiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
      },
    )

    return data
  },
}
