const axios = require('axios')
const gitlabToken = process.env.GITLAB_TOKEN
const featuresApiToken = process.env.FEATURES_API_TOKEN
const baseUrl = 'https://gitlab.com/api/v4'
const pbBaseUrl = 'https://TODO'
const integrationId = "TODO"

const mapping = []

module.exports = {
    createIssue: async (projectId, issue) => {
        const createdIssue = await axios.default.request({
            method: "post",
            url: `${baseUrl}/projects/${projectId}/issues`,
            data: issue,
            headers: {
                "PRIVATE-TOKEN": gitlabToken
            }
        })

        return createdIssue
    },

    storeMapping: function(featureId, issueId) {
        mapping[issueId] = featureId
    },

    notifyPb: async (issueId, issueProjectId, url, state) => {
        const featureId = mapping[issueId]
        const notificationData = {
          data: {
              genericIntegrations: [
                  {
                      id: integrationId,
                      text: `${state} Issue ${issueProjectId}`,
                      url: url
                  }
              ]
          }
        }

        // TODO: use correct address and stuff
        const response = await axios.default.request({
            method: "post",
            // TODO: feature ID is a query param
            url: `https://007b27b6cd3260d512d375e6e14c172f.m.pipedream.net`,
            data: notificationData,
            headers: {
                // TODO
            }
        })

        return response
    }
}