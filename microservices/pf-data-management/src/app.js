// 2022-01-01T00:15:00+02:00"
require('dotenv').config();
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Load Routes
const agtpRoutes = require('./routes/pf');
// Load database and models
const sequelize = require('./utils/database');
const ResolutionCode = require('./models/resolutionCode');
const PhysicalFlow = require('./models/physicalFlow');
const Country = require('./models/country');
const CountriesPair = require('./models/countries_pair');
// load database starting files
const app = express();

// Middleware
// app.use(bodyParser.urlencoded()); //form data x-www-form-urlencoded
app.use(bodyParser.json()); //application json
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//

// relationship between models
ResolutionCode.hasMany(CountriesPair, {
  foreignKey: 'resolution_code',
  constraints: true,
  onDelete: 'SET NULL',
});

Country.hasMany(CountriesPair, {
  foreignKey: 'country_out',
  constraints: true,
  onDelete: 'SET NULL',
});

Country.hasMany(CountriesPair, {
  foreignKey: 'country_in',
  constraints: true,
  onDelete: 'SET NULL',
});

CountriesPair.hasMany(PhysicalFlow, {
  foreignKey: 'countries_pair',
  constraints: true,
  onDelete: 'SET NULL',
});
//

// kafka
const consumer = require('./controllers/kafkaConsumer');
consumer().catch((err) => {
  console.error('error in consumer: ', err);
});
// ROUTES

//Handle all Valid Routes in the pf.js
app.use('/', agtpRoutes);
// page not found handler
app.use('/', (req, res, next) => res.status(404).send('Page not found'));
//

app.use((error, req, res, next) => {
  res.status(error.httpStatusCode || 500).json({
    ErrorMessage: error.message,
  });
  console.log('Global error handler');
});

const flag = false;

sequelize
  .sync({ force: flag })
  .then((result) => {
    // Connection established now create counties
    // if flag = true -> write over the database, if flag = false -> do not write over
    if (flag) {
      let countriesData = JSON.parse(fs.readFileSync('./src/utils/countries.json'));
      let countriesPairsData = JSON.parse(
        fs.readFileSync('./src/utils/countriesPairs.json')
      );

      Country.bulkCreate(countriesData.countriesdata)
        .then(() => {
          console.log('Countries db data created Successfully');
          const resCodes = [{ ID: 'PT15M' }, { ID: 'PT30M' }, { ID: 'PT60M' }];
          return ResolutionCode.bulkCreate(resCodes);
        })
        .then(() => {
          console.log('Resolution Codes created Successfully');
          CountriesPair.bulkCreate(countriesPairsData.countries_pairs);
        })
        .then(() => {
          console.log('Countries Pairs created Successfully');
        })
        .catch((err) => {
          console.log('err');
        });
    }
    console.log('Server Listening  on Port 8080');

    app.listen(8080);
  })
  .catch((error) => {
    console.log('From error Logger at app: ', error.message);
  });
