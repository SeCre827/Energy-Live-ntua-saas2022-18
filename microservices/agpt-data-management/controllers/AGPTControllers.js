const Countries = require('../models/countries');
const ProductionTypes = require('../models/productiontypes');
const ResolutionCodes = require('../models/resolutioncodes');
const AggrGenerationPerType = require('../models/aggrgenerationpertype');
const sequelize = require('../utils/database')
const { DateTime } = require('luxon');
const fs = require("fs");
const path = require("path");
const { Op } = require('sequelize');
const CountryProduction = require('../models/countryProduction');

const checkCountryID = (countryString) => {
    return (countryString.length === 2) && (/^[A-Z]{2}$/.test(countryString));
};

//AGPTController.getData
// URI '/getData/:country_ID/:production_type/:dateFrom/:dateTo'
exports.getData = (req, res, next) => {
    let countryID = req.params.country_ID;
    let prodType = req.params.production_type;
    if (!checkCountryID(countryID)) {
        const error = new Error('Country ID consists of two uppercase letters, e.g. "GR".');
        return next(error);
    }
    let dateFrom = DateTime.fromISO(req.params.dateFrom, { zone: 'utc' }).toISO();
    let dateTo = DateTime.fromISO(req.params.dateTo, { zone: 'utc' }).endOf('day').toISO();

    console.log(countryID, prodType, dateFrom, dateTo);

    AggrGenerationPerType.findAll({
        where: {
            country_ID: countryID,
            production_type: prodType,
            timestamp: { [Op.between]: [dateFrom, dateTo] },
        },
    }).then((agpt) => {
        if (!agpt.length) {
            const error = new Error('No data available.');
            return next(error);
        }
        const new_data = {
            country_ID: countryID,
            production_type: prodType,
            entries: [],
        };
        for (const item of agpt) {
            new_data.entries.push({
                timestamp: item.timestamp,
                value: item.value,
            });
        }
        res.status(200).json(new_data);
    }).catch((err) => {
        console.log('Error handler AGPTController');
        console.log(err);
    });
};

exports.importData = async (data) => {
    try {
        AggrGenerationPerType.bulkCreate(data, { updateOnDuplicate: ['value'] })
            .then((agpt) => {
                if (!agpt) {
                    const error = new Error('Error, data was not updated.');
                    return next(error);
                }
                console.log(`${agpt.length} entries were updated.`);
            }).catch((err) => {
            console.log('A database error has occurred.');
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

//AGPTController.resetData
exports.resetData = () => {
    sequelize.sync({ force: true }).then(() => {
        console.log('All tables were dropped.');
        let countriesData = JSON.parse(
            (fs.readFileSync(path.resolve(__dirname, '../utils/countriesdata.json'))).toString()
        );
        let generationtypesData = JSON.parse(
            (fs.readFileSync(path.resolve(__dirname, '../utils/generationtypes.json'))).toString()
        );
        const countryProductionData = JSON.parse(
            fs.readFileSync('./utils/country_production.json').toString()
        );

        Countries.bulkCreate(countriesData.countriesdata)
            .then(() => {
                const resolutionCodes = [{ ID: 'PT15M'}, { ID: 'PT30M'}, { ID: 'PT60M' }];
                ResolutionCodes.bulkCreate(resolutionCodes);
            })
            .then(() => {
                ProductionTypes.bulkCreate(generationtypesData.productiontypes);
            })
            .then(() => {
                CountryProduction.bulkCreate(countryProductionData);
            })
            .then(() => {
                AggrGenerationPerType.destroy({ where: {} });
            })
            .catch((err) => { console.log(err); });
    });
};