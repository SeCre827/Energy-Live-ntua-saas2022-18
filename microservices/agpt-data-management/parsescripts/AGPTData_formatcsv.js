const csv = require('csvtojson');
const { DateTime } = require('luxon');
const { writeFile } = require('fs/promises');

function filterProperties(item) {
    return {
        country_id:  item.MapCode,
        timestamp: item.DateTime,
        value: item.ActualGenerationOutput,
        production_type: item.ProductionType,
        resolution_code: item.ResolutionCode,
    };
}

function groupByCountries(filteredData) {
    // Makes a map with key based on country and value an array of objects of the corresponding entries
    //  Map -> key:Country value: [{},{}]
    let group = new Map();
    for (const item of filteredData) {
        if (!group.has(item.country_id)) {
            group.set(item.country_id, []);
        }
        group.get(item.country_id).push({
            value: item.value,
            timestamp: item.timestamp,
            production_type: item.production_type,
            resolution_code: item.resolution_code,
        });
    }

    let countryData = [];
    for (const [country_id, items] of group.entries()) {
        const new_data = {
            country_id: country_id,
            production_type: null,
            resolution_code: null,
            entries: [],
        };
        new_data.production_type = items.at(-2).production_type;
        new_data.resolution_code = items.at(-1).resolution_code;
        for (const item of items) {
            new_data.entries.push({
                value: item.value,
                timestamp: DateTime.fromSQL(item.timestamp, { zone: 'utc' }).toISO(),
            });
        }
        countryData.push(new_data);
    }
    return countryData;
}

async function csvToJson(path, time) {
    // Parse CSV into JSON
    const jsonArray = await csv({ delimiter: '\t' }).fromFile(path);

    // Keep only items with AreaTypeCode === 'CTY', and only properties
    // DateTime, ResolutionCode, MapCode, ProductionType, ActualGenerationOutput from each item
    const filteredData = jsonArray
        .filter((item) => item.AreaTypeCode === 'CTY')
        .map((item) => filterProperties(item));
    await writeFile(
        'AGPT_Data.json',
        JSON.stringify({
            timestamp: DateTime.fromISO(time, { zone: 'utc' }).toISO({ zone: 'utc' }),
            countries_data: groupByCountries(filteredData),
            //country: filteredData.country,
            //value: filteredData.value,
            //production_type: filteredData.production_type,
            //resolution_code: filteredData.resolution_code,
        })
    );
}
csvToJson(process.argv[2], process.argv[3]);
