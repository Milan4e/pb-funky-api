const axios = require('axios')
const baseUrl = 'https://api.productboard.com'

module.exports = {
  createNote: async (token, note) => {
    await axios.default.post(`${baseUrl}/notes`, note, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
}
