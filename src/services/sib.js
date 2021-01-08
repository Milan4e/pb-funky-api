const axios = require('axios')

const apiKey = process.env.SEND_IN_BLUE_KEY
const baseUrl = 'https://api.sendinblue.com/v3'
// sender email has to match an actual user previously created in SIB
const senderEmail = "psymilan@yahoo.com"
const htmlEmailContent = "People: get in here and build the campaign email!"
const emailSubject = "People: get in here and write a great subject!"

// https://developers.sendinblue.com/reference

module.exports = {
  createEmailCampaign: async (name) => {
    const result = await axios.default.post(
      `${baseUrl}/emailCampaigns`,
      {
        sender: {
          email: senderEmail
        },
        name: name,
        htmlContent: htmlEmailContent,
        subject: emailSubject
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

  createList: async (name) => {
    const result = await axios.default.post(
      `${baseUrl}/contacts/lists`,
      {
        name: name,
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
