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
const fillMissingData = require('../utils/fillMissingData.js');

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
        const fetched = {
            countryId: countryID,
            productionType: prodType,
            dateFrom: dateFrom,
            dateTo: dateTo,
            timestamp: DateTime.now().toISO(),
            data: agpt.map(
                (entry) => ({
                    timestamp: entry.timestamp,
                    value: entry.value
                })
            ),
        };
        res.status(200).json(fetched);
    }).catch((err) => {
        console.log('Error handler AGPTController');
        console.log(err);
    });
};

exports.importData = async (data) => {
    try {
        new_data = await fillMissingData(data);
        await AggrGenerationPerType.bulkCreate(new_data, { updateOnDuplicate: ['value'] })
            .then((agpt) => {
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