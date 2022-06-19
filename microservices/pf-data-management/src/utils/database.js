const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions: {
      ssl: {
          rejectUnauthorized: false,
      }
  }
});

// sequelize
//   .authenticate()
//   .then(() => {})
//   .catch((err) => {
//     console.error('Unable to connect to the database', err);
//   });

module.exports = sequelize;
