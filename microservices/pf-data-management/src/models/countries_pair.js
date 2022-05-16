const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const CountriesPair = sequelize.define(
  'countriesPair',
  {
    ID: {
      type: Sequelize.DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
    },
    country_in: {
      type: Sequelize.DataTypes.STRING(2),
      allowNull: false,
    },
    country_out: {
      type: Sequelize.DataTypes.STRING(2),
      allowNull: false,
    },
    resolution_code: {
      type: Sequelize.DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = CountriesPair;
