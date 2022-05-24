const Countries = require('../models/countries');
const ProductionTypes = require('../models/productiontypes');
const ResolutionCodes = require('../models/resolutioncodes');
const AggrGenerationPerType = require('../models/aggrgenerationpertype');
const sequelize = require('../utils/database')
const { DateTime } = require('luxon');
const fs = require("fs");
const path = require("path");
const { Op } = require('sequelize');

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
    let dateFrom = DateTime.fromSQL(req.params.dateFrom, { zone: 'utc' }).toISO();
    let dateTo = DateTime.fromSQL(req.params.dateTo, { zone: 'utc' }).toISO();

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

        // RETURN all data in a json
        // timestamp-value pairs

        let totalValue = 0;
        for (const entry of agpt) {
            console.log(entry.value);
            totalValue += parseFloat(entry.value);
        }
        // return an array in message
        res.status(200).json({
            message: `The total AGPT value is ${totalValue}`,
        });
    }).catch((err) => {
            console.log('Error handler AGPTController');
            console.log(err);
        });
    };

//AGPTController.postData
exports.postData = async (req, res, next) => {
    try {
        if (req.file === undefined)
            throw Error('File not found.');
        const file = req.file;
        const data = JSON.parse(file.buffer);
        console.log(data);

        AggrGenerationPerType.bulkCreate(data.countries_data, { updateOnDuplicate: ['value'] })
            .then((agpt) => {
                if (!agpt) {
                    const error = new Error('Error, data was not updated.');
                    return next(error);
                }
                let message = `${agpt.length} entries were updated.`;
                res.status(200).json({ message: message });
            }).catch((err) => {
                console.log('A database error has occurred.');
                next(err);
            })
    } catch (error) {
        next(error);
    }
}

//AGPTController.resetData
exports.resetData = (req, res, next) => {
    sequelize.sync({ force: true }).then((result) => {
        console.log('All tables were dropped.');
        let countriesData = JSON.parse(
            (fs.readFileSync(path.resolve(__dirname, '../utils/countriesdata.json'))).toString()
        );
        let generationtypesData = JSON.parse(
            (fs.readFileSync(path.resolve(__dirname, '../utils/generationtypes.json'))).toString()
        );
        Countries.bulkCreate(countriesData.countriesdata)
            .then(() => {
                const resolutionCodes = [{ ID: 'P15M'}, { ID: 'PT30M'}, { ID: 'PT60M' }];
                return ResolutionCodes.bulkCreate(resolutionCodes);
                })
            .then(() => {
                ProductionTypes.bulkCreate(generationtypesData);
            })
            .then(() => {
                res.status(200).json({ message: 'Database was reset.'});
            })
            .catch((err) => { next(err); });
    });
};