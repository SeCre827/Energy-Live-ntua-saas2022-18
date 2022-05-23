const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Countries = sequelize.define(
    'country',
    {
        ID: {
            type: Sequelize.DataTypes.STRING(2),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        resolution_code: {
            type: Sequelize.DataTypes.STRING(5),
            allowNull: false
        }
    },
    { timestamps: false }
);

module.exports = Countries;
