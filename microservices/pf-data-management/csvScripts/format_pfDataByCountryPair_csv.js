const csv = require('csvtojson');
const { DateTime } = require('luxon');
const { writeFile } = require('fs/promises');

// this function filters the data from the csv.
// We keep only the columns we are intrested in
function filterProperties(item) {
  return {
    country_out: item.OutMapCode,
    country_in: item.InMapCode,
    timestamp: item.DateTime,
    value: item.FlowValue,
    resolution_code: item.ResolutionCode,
  };
}

// Gets the filtered data and groups them by country pair.
// Returns an array of objects like the below:
// {
//   "countries_pair": "AT_SI",
//   "resolution_code": "PT15M",
//   "entries": [
//     { "value": "38.68", "timestamp": "2022-01-01T00:00:00.000Z" },
//     { "value": "38.2", "timestamp": "2022-01-01T00:15:00.000Z" },
//     { "value": "53.16", "timestamp": "2022-01-01T00:30:00.000Z" },
//     { "value": "0.0", "timestamp": "2022-01-01T00:45:00.000Z" }
//   ]
// }
function groupByCountriesPair(filteredData) {
  // Makes a map with key based on country_in_coutnry_out pair and value an array of objects of the corresponding entries
  //  Map -> key:Cin_Cou value: [{},{}]
  let group = new Map();
  for (const item of filteredData) {
    if (!group.has(item.country_in + '_' + item.country_out)) {
      group.set(item.country_in + '_' + item.country_out, []);
    }
    group.get(item.country_in + '_' + item.country_out).push({
      value: item.value,
      timestamp: item.timestamp,
      resolution_code: item.resolution_code,
    });
  }

  // CountryPairsData will be the array we return
  let countryPairsData = [];
  for (const [countryPair, items] of group.entries()) {
    const new_data = {
      countries_pair: countryPair,
      resolution_code: null,
      entries: [],
    };
    new_data.resolution_code = items.at(-1).resolution_code;
    for (const item of items) {
      new_data.entries.push({
        value: item.value,
        timestamp: DateTime.fromSQL(item.timestamp, { zone: 'utc' }).toISO(),
      });
    }
    countryPairsData.push(new_data);
  }
  return countryPairsData;
}

async function csvToJson(path, time) {
  // Parse CSV into JSON
  const jsonArray = await csv({ delimiter: '\t' }).fromFile(path);

  // Keep only items with AreaTypeCode === 'CTY', and only properties
  // DateTime, ResolutionCode, MapCode, TotalLoadValue from each item
  const filteredData = jsonArray
    .filter((item) => item.OutAreaTypeCode === 'CTY')
    .map((item) => filterProperties(item));
  await writeFile(
    'PF_Data.json',
    JSON.stringify({
      timestamp: DateTime.fromISO(time, { zone: 'utc' }).toISO({ zone: 'utc' }),
      countries_pairs_data: groupByCountriesPair(filteredData),
      // pfData: filteredData,
    })
  );
}

csvToJson(process.argv[2], process.argv[3]);
