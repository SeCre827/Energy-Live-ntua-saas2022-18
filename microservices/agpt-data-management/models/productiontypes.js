const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ProductionTypes = sequelize.define(
    'productionType',
    {
        ID: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
    },
    { timestamps: false }
);

module.exports = ProductionTypes;
