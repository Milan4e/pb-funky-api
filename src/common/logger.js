const bunyan = require('bunyan')

const logStreams = []

// Stdout stream
logStreams.push({
  level: 'debug',
  stream: process.stdout,
})

const logger = bunyan.createLogger({
  name: 'pb-funky-api',
  streams: logStreams,
})

module.exports = logger
