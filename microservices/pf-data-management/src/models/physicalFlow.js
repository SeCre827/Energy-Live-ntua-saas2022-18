const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const PhysicalFlow = sequelize.define(
  'physicalFlow',
  {
    // ID: {
    //   type: Sequelize.DataTypes.INTEGER(2),
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: true,
    // },
    countries_pair: {
      primaryKey: true,
      type: Sequelize.DataTypes.STRING(5),
      allowNull: false,
    },
    timestamp: {
      primaryKey: true,
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    value: {
      type: Sequelize.DataTypes.DECIMAL,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = PhysicalFlow;
