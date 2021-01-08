const Twit = require('twit')

const TwitterClient = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY || 'dev',
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET || 'dev',
  access_token:         process.env.TWITTER_ACCESS_TOKEN || 'dev',
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET || 'dev',
});

module.exports = {
  tweet: async (name) => {
    return new Promise((resolve) => {
      TwitterClient.post('statuses/update', { status: `🎉 Our lovely ${name} feature was just released! 🎉`}, function(err, data) {
        resolve(data)
      })
    })
  },
}
