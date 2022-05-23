const app = require("./app");
const Countries = require('./models/countries');
const ProductionTypes = require('./models/productiontypes');
const ResolutionCodes = require('./models/resolutioncodes');
const AggrGenerationPerType = require('./models/aggrgenerationpertype');
const sequelize = require("./utils/database");
const fs = require("fs");

ResolutionCodes.hasMany(Countries, {
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

const forcesync = false;

sequelize
    .sync({ force: forcesync })
    .then((res) => {
        // Connection established now create counties
        // if flag = true -> write over the database, if flag = false -> do not write over
        if (forcesync) {
            let countriesData = JSON.parse((fs.readFileSync('./utils/countries.json')).toString());
            let productiontypesData = JSON.parse((
                fs.readFileSync('./utils/generationtypes.json')).toString()
            );

            Countries.bulkCreate(countriesData.countriesdata)
                .then(() => {
                    console.log('Countries Data created successfully.');
                    const resolutioncodes = [{ ID: 'PT15M' }, { ID: 'PT30M' }, { ID: 'PT60M' }];
                    return ResolutionCodes.bulkCreate(resolutioncodes);
                })
                .then(() => {
                    console.log('Resolution Codes created successfully.');
                    ProductionTypes.bulkCreate(productiontypesData);
                })
                .then(() => {
                    console.log('Generation Types created successfully.');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        console.log('Server listening on port 4009');

        app.listen(4009);
    })
    .catch((error) => {
        console.log('From error Logger at app: ', error.message);
    });