const axios = require('axios')
const gitlabToken = process.env.GITLAB_TOKEN
const baseUrl = 'https://gitlab.com/api/v4'
const pbBaseUrl = 'https://TODO'
const integrationId = "5685b366-fffa-4f35-b1ae-e0506b232a5b"
const productboardToken = process.env.PRODUCTBOARD_TOKEN
const logger = require('../common/logger')

const issueIdsToFeatureIds = []
const featureIdsToIssueIIDs = []

const pbHeaders = {
    Authorization: `Bearer ${productboardToken}`,
    'X-Version': 1,
    Accept: 'application/json'
};

function colorFromState(state) {
    if (state === 'opened') {
        return 'blue';
    } else {
        return 'red';
    }
}

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

    updateIssue: async (projectId, featureId, newTitle) => {
        // find issue IID (ID within project)
        const issueIID = featureIdsToIssueIIDs[featureId]
        if (!issueIID) {
            return;
        }

        logger.info({ issueIID })

        const updatedIssue = await axios.default.request({
            method: "put",
            url: `${baseUrl}/projects/${projectId}/issues/${issueIID}`,
            data: {
                title: newTitle
            },
            headers: {
                "PRIVATE-TOKEN": gitlabToken
            }
        })

        return updatedIssue
    },

    storeMapping: function(featureId, issue) {
        issueIdsToFeatureIds[issue.id] = featureId
        featureIdsToIssueIIDs[featureId] = issue.iid
    },

    getFeatureFromPb : async (uri) => {
        return await axios.default.get(uri, {
            headers: pbHeaders
        })
    },

    colorFromState: colorFromState,

    notifyPb: async (issueId, issueProjectId, url, state) => {
        const featureId = issueIdsToFeatureIds[issueId]

        const connectionData = {
            "data": {
                "connection": {
                    "state": "connected",
                    "label": state,
                    "hoverLabel": `${issueProjectId}`,
                    "tooltip": `Issue ${issueProjectId}`,
                    "color": colorFromState(state),
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
