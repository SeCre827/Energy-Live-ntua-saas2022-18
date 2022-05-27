const app = require("./app");
const Countries = require('./models/countries');
const ProductionTypes = require('./models/productiontypes');
const ResolutionCodes = require('./models/resolutioncodes');
const AggrGenerationPerType = require('./models/aggrgenerationpertype');
const sequelize = require("./utils/database");
const fs = require("fs");

ResolutionCodes.hasMany(AggrGenerationPerType, {
    foreignKey: 'resolution_code',
    constraints: true,
    onDelete: 'SET NULL',
});

Countries.hasMany(AggrGenerationPerType, {
    foreignKey: 'country_ID',
    constraints: true,
    onDelete: 'SET NULL',
});

ProductionTypes.hasMany(AggrGenerationPerType, {
    foreignKey: 'production_type',
    constraints: true,
    onDelete: 'SET NULL',
});

const forcesync = true;

sequelize
    .sync({ force: forcesync })
    .then(() => {
        // if flag = true -> write over the database, if flag = false -> don't write over the database
        if (forcesync) {
            let countriesData = JSON.parse((fs.readFileSync('./utils/countriesdata.json')).toString());
            let productiontypesData = JSON.parse((
                fs.readFileSync('./utils/generationtypes.json')).toString()
            );

            Countries.bulkCreate(countriesData.countriesdata)
                .then(() => {
                    console.log('Countries data created successfully.');
                    const resolutioncodes = [{ ID: 'PT15M' }, { ID: 'PT30M' }, { ID: 'PT60M' }];
                    return ResolutionCodes.bulkCreate(resolutioncodes);
                })
                .then(() => {
                    console.log('Resolution Codes data created successfully.');
                    ProductionTypes.bulkCreate(productiontypesData.productiontypes);
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