const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Country = sequelize.define(
  'country',
  {
    ID: {
      type: Sequelize.DataTypes.STRING(2),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Country;
