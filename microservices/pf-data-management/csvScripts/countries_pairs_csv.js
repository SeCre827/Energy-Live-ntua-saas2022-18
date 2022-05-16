const csv = require('csvtojson');
const { DateTime } = require('luxon');
const { writeFile } = require('fs/promises');

/*
This program returns the countries pair data for countries_pair model
How the data looks like
{
  "ID": "AT_SI",
  "country_in": "AT",
  "country_out": "SI",
  "resolution_code": "PT15M"
}

how to call it: node countries_pair_csv csv_name







*/
// this function filters the data from the csv.
// We keep only the columns we are intrested in
function filterProperties(item) {
  return {
    country_out: item.OutMapCode,
    country_in: item.InMapCode,
    resolution_code: item.ResolutionCode,
  };
}

function groupByCountriesPair(filteredData) {
  // Makes a map with key based on country_in_coutnry_out pair and value an array of objects of the corresponding entries
  //  Map -> key:Cin_Cou value: [{},{}]
  let group = new Map();
  for (const item of filteredData) {
    if (!group.has(item.country_in + '_' + item.country_out)) {
      group.set(item.country_in + '_' + item.country_out, []);
    }
    group.get(item.country_in + '_' + item.country_out).push({
      resolution_code: item.resolution_code,
    });
  }

  // CountryPairsData will be the array we return
  let countryPairsData = [];
  for (const [countryPair, items] of group.entries()) {
    const new_data = {
      ID: countryPair,
      country_in: countryPair.substring(0, 2),
      country_out: countryPair.substring(3, 5),
      resolution_code: null,
    };
    new_data.resolution_code = items.at(-1).resolution_code;
    countryPairsData.push(new_data);
  }
  return countryPairsData;
}

async function csvToJson(path) {
  // Parse CSV into JSON
  const jsonArray = await csv({ delimiter: '\t' }).fromFile(path);

  // Keep only items with AreaTypeCode === 'CTY', and only properties
  // DateTime, ResolutionCode, MapCode, TotalLoadValue from each item
  const filteredData = jsonArray
    .filter((item) => item.OutAreaTypeCode === 'CTY')
    .map((item) => filterProperties(item));
  await writeFile(
    'countriesPairs.json',
    JSON.stringify({
      countries_pairs: groupByCountriesPair(filteredData),
    })
  );
}

csvToJson(process.argv[2]);
