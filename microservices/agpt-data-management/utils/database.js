const Sequelize = require('sequelize');
const sequelize = new Sequelize('agpt-data-management-db', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
