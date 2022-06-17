const { DateTime } = require("luxon");
const CountryProduction = require("../models/countryProduction");

async function fillMissingData(countries_data) {
  // Find the entries corresponding to each country-production pair
  const countryProductionMap = new Map();
  for (const entry of countries_data) {
    const key = entry.country_ID + '_' + entry.production_type
    if (!countryProductionMap.has(key)) {
      countryProductionMap.set(key, [entry]);
    } else {
      countryProductionMap.get(key).push(entry);
    }
  }

  // Sort the entries in ascending time order for each country-production pair
  for (const entryArray of countryProductionMap.values()) {
    entryArray.sort(
      (a, b) => DateTime.fromISO(a.timestamp) < DateTime.fromISO(b.timestamp) ?  -1 : 1
    );
  }

  // Fetch country-production information from the DB to determine
  // resolution codes
  const resCodeMap = new Map();
  for (const entry of (await CountryProduction.findAll())) {
    resCodeMap.set(
      entry.country_ID + '_' + entry.production_type,
      entry.resolution_code
    );
  }

  // Find any missing entries for each country-production pair (according to
  // it resolution code) and fill it with a null value.
  for (const [countryProduction, entries] of countryProductionMap.entries()) {
    const [country, production] = countryProduction.split('_');
    let dt = DateTime.fromISO(entries[0].timestamp, { zone: 'utc' }).startOf('month');
    let i = 0; 
    const len = entries.length;

    // Check if the current entry of the entries list has the current timestamp
    // If yes, continue to the next entry
    // Otherwise, we have found a missing timestamp; create a corresponding entry
    // with a null value
    while (i < len) {
      if (entries[i].timestamp !== dt.toISO()) {
        entries.push({
          country_ID: country,
          production_type: production,
          timestamp: dt.toISO(),
          value: null
        });
      } else {
        i++;
      }

      // Increment the current timestamp according to the resolution code
      const resCode = resCodeMap.get(countryProduction);
      if (resCode === 'PT15M') {
        dt = dt.plus({ minutes: 15 });
      } else if (resCode === 'PT30M') {
        dt = dt.plus({ minutes: 30 });
      } else if (resCode === 'PT60M') {
        dt = dt.plus({ minutes: 60 });
      }
    }
  }

  // Place all entries (existing and missing) in an array, then return it
  const result = [];
  for (const entries of countryProductionMap.values()) {
    result.push(...entries);
  }
  return result;
}

module.exports = fillMissingData;