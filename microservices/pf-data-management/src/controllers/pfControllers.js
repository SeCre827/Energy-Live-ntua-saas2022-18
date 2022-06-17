// Na dw to find_query na ginetai me join
// Ta null values sto csv
const fs = require('fs');
const path = require('path');
const sequelize = require('../utils/database');
const { DateTime } = require('luxon');
const CountriesPair = require('../models/countries_pair');
const Country = require('../models/country');
const PhysicalFlow = require('../models/physicalFlow');
const ResolutionCode = require('../models/resolutionCode');

const { Op } = require('sequelize');
const fillMissingData = require('../utils/fillMissingData');

// Checks is 2 char aplharithetic is valid
const countryParamValidator = (countryString) => {
  if (countryString.length === 2) {
    if (/^[A-Z]*$/.test(countryString)) {
      return true;
    }
  }
  return false;
};

exports.resetDB = () => {
  sequelize.sync({ force: true }).then((result) => {
    console.log('All tables were droped');
    let countriesData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../utils/countries.json'))
    );
    let countriesPairsData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../utils/countriesPairs.json'))
    );

    Country.bulkCreate(countriesData.countriesdata)
      .then(() => {
        const resCodes = [{ ID: 'PT15M' }, { ID: 'PT30M' }, { ID: 'PT60M' }];
        return ResolutionCode.bulkCreate(resCodes);
      })
      .then(() => {
        CountriesPair.bulkCreate(countriesPairsData.countries_pairs);
      })
      .then(() => {
        console.log('Database reset completed successfully!');
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// url '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo',
exports.getData = (req, res, next) => {
  let countryFrom = req.params.countryFrom;
  let countryTo = req.params.countryTo;
  // let dateFrom = req.params.dateFrom;
  // let dateFrom = req.params.dateFrom;
  let dateFrom = DateTime.fromISO(req.params.dateFrom, {
    zone: 'utc',
  }).startOf('day').toISO();
  let dateTo = DateTime.fromISO(req.params.dateTo, {
    zone: 'utc',
  }).endOf('day').toISO();
  console.log(countryFrom, countryTo, dateFrom, dateTo);
  // validation for the countries param
  if (
    !countryParamValidator(countryFrom) ||
    !countryParamValidator(countryFrom)
  ) {
    const error = new Error(
      'Countries strings must be of length two and contain only uppercase letters.'
    );
    error.httpStatusCode = 400;
    return next(error);
  }
  // validation for date params

  // query
  PhysicalFlow.findAll({
    where: {
      countries_pair: countryFrom + '_' + countryTo,
      timestamp: {
        [Op.between]: [dateFrom, dateTo],
      },
    },
    order: [['timestamp', 'ASC']]
  })
    .then((physicalFlows) => {
      if (!physicalFlows.length) {
        const error = new Error('No data was found.');
        error.httpStatusCode = 422;
        return next(error);
      }
      res.status(200).json({
        countryFrom: countryFrom,
        countryTo: countryTo,
        dateFrom: dateFrom,
        dateTo: dateTo,
        timestamp: DateTime.now().toISO(),
        data: physicalFlows.map(
          (entry) => ({
            timestamp: entry.timestamp,
            value: entry.value
          })
        )
      });
    })
    .catch((err) => {
      console.log('In error handler 43 agtpController');
      console.log(err);
    });
};

// Controller for /update_data endpoint
exports.updateData = async (req, res, next) => {
  try {
    if (req.file === undefined) throw Error('No file provided');
    const file = req.file; // raw data = file.buffer
    const data = JSON.parse(file.buffer); // Data in js object notation we will need the countries_pair_data property.

    PhysicalFlow.bulkCreate(data.countries_pairs_data, {
      // ignoreDuplicates: true,
      updateOnDuplicate: ['value'],
    })
      .then((pfData) => {
        if (!pfData) {
          const error = new Error(
            'No data was updated. Check the file you provided!'
          );
          error.httpStatusCode = 422;
          return next(error);
        }
        let message = `${pfData.length} records where updated `;
        // console.log(message);
        res.status(200).json({
          message: message,
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error('A database error has occured!');
        error.httpStatusCode = 500;
        return next(error);
      });
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

exports.updateData2 = async (data) => {
  try {
    if (data === undefined) throw Error('No data provided');
    // const file = req.file; // raw data = file.buffer
    // const data = JSON.parse(file.buffer); // Data in js object notation we will need the countries_pair_data property.

    const new_data = await fillMissingData(data.countries_pairs_data);

    PhysicalFlow.bulkCreate(new_data, {
      // ignoreDuplicates: true,
      updateOnDuplicate: ['value'],
    }).then((pfData) => {
        if (!pfData) {
          const error = new Error(
            'No data was updated. Check the file you provided!'
          );
          error.httpStatusCode = 422;
          throw error;
        }
        let message = `${pfData.length} records where updated `;
        // console.log(message);
        console.log(message);
      })
      .catch((err) => {
        console.log(err);
        const error = new Error('A database error has occured!');
        error.httpStatusCode = 500;
        throw error;
      });
  } catch (error) {
    error.httpStatusCode = 400;
    console.log(error);
  }
};

// CountriesPair.bulkCreate(countriesPairsData.countries_pairs, {
//   ignoreDuplicates: true,
// })
