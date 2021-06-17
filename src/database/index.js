const Sequelize = require('sequelize')
const models = require('./models')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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
