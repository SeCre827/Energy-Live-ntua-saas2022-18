const Sequelize = require('sequelize');
const sequelize = new Sequelize('agpt_data', 'admin', 'password', {
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
