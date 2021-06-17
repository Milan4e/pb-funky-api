const axios = require('axios')
const pbToken = process.env.PB_TOKEN
const baseUrl = 'https://api.productboard.com'

module.exports = {
  createNote: async (note) => {
    await axios.default.post(`${baseUrl}/notes`, note, {
      headers: {
        Authorization: `Bearer ${pbToken}`
      }
    })
  },
}
