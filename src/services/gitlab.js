const axios = require('axios')
const gitlabToken = process.env.GITLAB_TOKEN
const baseUrl = 'https://gitlab.com/api/v4'
const pbBaseUrl = 'https://TODO'
const integrationId = "5685b366-fffa-4f35-b1ae-e0506b232a5b"
const productboardToken = process.env.PRODUCTBOARD_TOKEN
const logger = require('../common/logger')

const mapping = []

const pbHeaders = {
    Authorization: `Bearer ${productboardToken}`,
    'X-Version': 1,
    Accept: 'application/json'
};
module.exports = {
    createIssue: async (projectId, issue) => {
        return await axios.default.request({
            method: "post",
            url: `${baseUrl}/projects/${projectId}/issues`,
            data: issue,
            headers: {
                "PRIVATE-TOKEN": gitlabToken
            }
        })
    },

    storeMapping: function(featureId, issueId) {
        mapping[issueId] = featureId
    },

    getFeatureFromPb : async (uri) => {
        return await axios.default.get(uri, {
            headers: pbHeaders
        })
    },

    notifyPb: async (issueId, issueProjectId, url, state) => {
        const featureId = mapping[issueId]

        const connectionData = {
            "data": {
                "connection": {
                    "state": "connected",
                    "label": state,
                    "hoverLabel": `${issueId}`,
                    "tooltip": `Issue ${issueId}`,
                    "color": "blue",
                    "targetUrl": url
                }
            }
        }

        return await axios.default.request({
            method: "PUT",
            // Should be loaded from mapping
            url: `https://api.productboard.com/plugin-integrations/${integrationId}/connections/${featureId}`,
            data: connectionData,
            headers: pbHeaders
        })
    }
}
