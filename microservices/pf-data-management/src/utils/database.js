const Sequelize = require('sequelize');
//                               database, username , password
const sequelize = new Sequelize('pf_data', 'admin', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// sequelize
//   .authenticate()
//   .then(() => {})
//   .catch((err) => {
//     console.error('Unable to connect to the database', err);
//   });

module.exports = sequelize;
