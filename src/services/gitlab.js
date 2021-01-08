const axios = require('axios')
const gitlabToken = process.env.GITLAB_TOKEN
const baseUrl = 'https://gitlab.com/api/v4'
const pbBaseUrl = 'https://TODO'
const integrationId = "TODO"

const issueIdsToFeatureIds = []
const featureIdsToIssueIIDs = []

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

    updateIssue: async (projectId, featureId, newTitle) => {
        // find issue IID (ID within project)
        const issueIID = featureIdsToIssueIIDs[featureId]

        const updatedIssue = await axios.default.request({
            method: "post",
            url: `${baseUrl}/projects/${projectId}/issues/${issueIID}`,
            data: {
                title: newTitle
            },
            headers: {
                "PRIVATE-TOKEN": gitlabToken
            }
        })

        return createdIssue
    },

    storeMapping: function(featureId, issue) {
        issueIdsToFeatureIds[issue.id] = featureId
        featureIdsToIssueIIDs[featureId] = issue.iid
    },

    notifyPb: async (issueId, issueProjectId, url, state) => {
        const featureId = issueIdsToFeatureIds[issueId]
        const notificationData = {
          data: {
              genericIntegrations: [
                  {
                      id: '6bb9d18e-5390-43e4-9696-47b289e03ccd',
                      text: `${state} Issue ${issueProjectId}`,
                      url: url
                  }
              ]
          }
        }

        const response = await axios.default.request({
            method: "PUT",
            url: `http://localhost:8080/features/${featureId}`,
            data: notificationData,
            headers: {
                'X-Space-Id': 46886,
                'X-User-Id': 22872,
                'X-Role': 'admin',
                'Content-Type': 'application/json',
                'X-Version': '1'
            }
        })

        return response
    }
}
