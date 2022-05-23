const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ResolutionCodes = sequelize.define(
    'resolutionCode',
    {
        ID: {
            type: Sequelize.DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true
        },
    },
    { timestamps: false }
);

module.exports = ResolutionCodes;
