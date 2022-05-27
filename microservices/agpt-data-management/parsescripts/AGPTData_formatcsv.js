const csv = require('csvtojson');
const { DateTime } = require('luxon');
const { writeFile } = require('fs/promises');

function filterProperties(item) {
    return {
        country_ID:  item.MapCode,
        timestamp: item.DateTime,
        production_type: item.ProductionType,
        resolution_code: item.ResolutionCode,
        value: (item.ActualGenerationOutput || 0),
    };
}

async function csvToJson(path) {
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
            //timestamp: DateTime.fromISO(time, { zone: 'utc' }).toISO({ zone: 'utc' }),
            countries_data: filteredData,
        })
    );
}
csvToJson(process.argv[2]);