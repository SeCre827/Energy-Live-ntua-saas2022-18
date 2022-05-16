// Na dw to find_query na ginetai me join
// Ta null values sto csv

const { DateTime } = require('luxon');
const CountriesPair = require('../models/countries_pair');
const PhysicalFlow = require('../models/physicalFlow');
const { Op } = require('sequelize');

// Checks is 2 char aplharithetic is valid
const countryParamValidator = (countryString) => {
  if (countryString.length === 2) {
    if (/^[A-Z]*$/.test(countryString)) {
      return true;
    }
  }
  return false;
};

// url '/getData/:countryFrom/:countryTo/:dateFrom/:dateTo',
exports.getData = (req, res, next) => {
  let countryFrom = req.params.countryFrom;
  let countryTo = req.params.countryTo;
  // let dateFrom = req.params.dateFrom;
  // let dateFrom = req.params.dateFrom;
  let dateFrom = DateTime.fromSQL(req.params.dateFrom, {
    zone: 'utc',
  }).toISO();
  let dateTo = DateTime.fromSQL(req.params.dateTo, {
    zone: 'utc',
  }).toISO();
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
  // kati ginetai me ta time zones
  PhysicalFlow.findAll({
    where: {
      countries_pair: countryFrom + '_' + countryTo,
      timestamp: {
        [Op.between]: [dateFrom, dateTo],
      },
    },
  })
    .then((physicalFlows) => {
      if (!physicalFlows.length) {
        const error = new Error('No data was found.');
        error.httpStatusCode = 422;
        return next(error);
      }
      let physicalFlowsObjectsArray = JSON.stringify(physicalFlows, null, 2);
      console.log(physicalFlowsObjectsArray);
      let totalValue = 0;
      for (const entry of physicalFlows) {
        console.log(entry.value);
        totalValue += parseFloat(entry.value);
      }
      res.status(200).json({
        message: `The total physical flow value is ${totalValue}`,
      });
    })
    .catch((err) => {
      console.log('In error handler 43 agtpController');
      console.log(err);
    });
};

exports.pog = (req, res, next) => {
  res.send('Gamw thn mana sas');
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
        console.log(message);
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

// CountriesPair.bulkCreate(countriesPairsData.countries_pairs, {
//   ignoreDuplicates: true,
// })
