module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
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
