const app = require("./app");
const Countries = require('./models/countries');
const ProductionTypes = require('./models/productiontypes');
const ResolutionCodes = require('./models/resolutioncodes');
const AggrGenerationPerType = require('./models/aggrgenerationpertype');
const CountryProduction = require('./models/countryProduction');
const sequelize = require("./utils/database");
const fs = require("fs");

ResolutionCodes.hasMany(CountryProduction, {
    foreignKey: 'resolution_code',
    constraints: true,
    onDelete: 'SET NULL',
});

Countries.hasMany(CountryProduction, {
    foreignKey: 'country_ID',
    constraints: true,
    onDelete: 'SET NULL',
});

ProductionTypes.hasMany(CountryProduction, {
    foreignKey: 'production_type',
    constraints: true,
    onDelete: 'SET NULL',
});

const forcesync = false;

sequelize
    .sync({ force: forcesync })
    .then(() => {
        // if flag = true -> write over the database, if flag = false -> don't write over the database
        if (forcesync) {
            const countriesData = JSON.parse((fs.readFileSync('./utils/countriesdata.json')).toString());
            const productiontypesData = JSON.parse((
                fs.readFileSync('./utils/generationtypes.json')).toString()
            );
            const countryProductionData = JSON.parse(
                fs.readFileSync('./utils/country_production.json').toString()
            );

            Countries.bulkCreate(countriesData.countriesdata)
                .then(() => {
                    const resolutioncodes = [{ ID: 'PT15M' }, { ID: 'PT30M' }, { ID: 'PT60M' }];
                    ResolutionCodes.bulkCreate(resolutioncodes);
                    console.log('Countries data created successfully.');
                })
                .then(() => {
                    ProductionTypes.bulkCreate(productiontypesData.productiontypes);
                    console.log('Resolution Codes data created successfully.');
                })
                .then(() => {
                    CountryProduction.bulkCreate(countryProductionData);
                    console.log('Country Production data created successfully.');
                })
                .then(() => {
                    console.log('Generation Types data created successfully.');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        console.log('Server listening on port 4009');

        app.listen(4009);
    })
    .catch((error) => {
        console.log('From error logger at app: ', error.message);
    });