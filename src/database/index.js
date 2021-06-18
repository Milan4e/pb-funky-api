const Sequelize = require('sequelize')
const models = require('./models')

const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgres://miro@miro:localhost:5432/miro'

const sequelize = new Sequelize(DATABASE_URL, {
  operatorsAliases: false,
  dialect: 'postgres',
  pool: {
    max: 500,
    min: 0,
    idle: 10000,
    acquire: 20000,
  },
  logging: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

// Import all models
const db = {}
Object.entries(models).forEach(([modelName, modelDef]) => {
  const model = sequelize.import(modelName, modelDef)
  db[model.name] = model
})

// Load relations between models
Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = db
