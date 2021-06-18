module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    access_token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
    {
      tableName: 'users',
      timestamps: false,
      underscored: true,
    },
  )

  return User
}
