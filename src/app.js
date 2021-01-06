const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')
const routes = require('./routes')
const middleware = require('./middleware')
const logger = require('./common/logger')

const app = new Koa()

// Setup middleware
app.use(koaCompress())
app.use(koaBody({
  multipart: true,
}))
app.use(koaCors({
  origin: '*',
  exposeHeaders: [
    'Authorization',
    'Content-Language',
    'Content-Length',
    'Content-Type',
    'Date',
    'ETag',
  ],
  maxAge: 3600,
}))

app.use(middleware.errors.handleErrors)

// Setup routes
app.use(routes)

// Start method
app.start = () => {
  logger.info('Starting server ...')

  const port = process.env.PORT || 3000
  app.server = app.listen(port, () => {
    logger.info(`==> 🌎  Server listening on port ${port}.`)
  })
}

// Stop method
app.stop = () => {
  if (!app.server) {
    return
  }

  app.server.close(() => {
    logger.info('Server stopped.')
  })
}
app.on('error', (err) => logger.error({ err }, 'Application error.'))

process.once('uncaughtException', fatal)
process.once('unhandledRejection', fatal)

function fatal(err) {
  logger.fatal(err, 'Fatal error occurred. Exiting the app.')

  setTimeout(() => {
    throw err
  }, 5000).unref()
}

app.start()