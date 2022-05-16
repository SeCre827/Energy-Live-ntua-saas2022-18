const csv = require('csvtojson');
const { DateTime } = require('luxon');
const { writeFile } = require('fs/promises');

/*
This program returns the data formatted to be used in the updateData endpoint
how to call it: node PF_dataFormater_csv csv_file
data format:
{
"countries_pairs_data": [

  {
      "countries_pair": "AT_SI",
      "timestamp": "2022-01-01 00:00:00",
      "value": "38.68"
    },
    {
      "countries_pair": "HU_RO",
      "timestamp": "2022-01-01 00:00:00",
      "value": "0.0"
    }
  ]
}


*/

// this function filters the data from the csv.
// We keep only the columns we are intrested in
function filterProperties(item) {
  return {
    countries_pair: item.InMapCode + '_' + item.OutMapCode,
    timestamp: item.DateTime.substring(0, 19),
    value: item.FlowValue,
  };
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
    'just_data.json',
    JSON.stringify({
      countries_pairs_data: filteredData,
    })
  );
}

csvToJson(process.argv[2]);
