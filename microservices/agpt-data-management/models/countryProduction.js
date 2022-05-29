const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const CountryProduction = sequelize.define(
  'countryProduction',
  {
    country_ID: {
      primaryKey: true,
      type: Sequelize.DataTypes.STRING(2),
      allowNull: false
    },
    production_type: {
      primaryKey: true,
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    resolution_code: {
      type: Sequelize.DataTypes.STRING(5),
      allowNull: false,
    }
  },
  { timestamps: false }
)

module.exports = CountryProduction;