const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define(
  'user',
  {
    email: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: Sequelize.DataTypes.STRING(40),
      allowNull: false,
    },
    last_name: {
      type: Sequelize.DataTypes.STRING(2),
      allowNull: true,
    },
    last_login: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
    licence_expiration: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
