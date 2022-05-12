import { drive_v3 } from 'googleapis';
import { DateTime } from 'luxon';

const datasets = [
  {
    name: "ActualTotalLoad",
    dataset_id: process.env.ATL_DATASET_ID,
    current_id: process.env.ATL_CURRENT_ID
  },
  {
    name: "AggrGenerationPerType",
    dataset_id: process.env.AGPT_DATASET_ID,
    current_id: process.env.AGPT_CURRENT_ID
  },
  {
    name: "PhysicalFlows",
    dataset_id: process.env.PF_DATASET_ID,
    current_id: process.env.PF_CURRENT_ID
  },
];

function getDateTime(name: string | undefined | null) {
  const fields = name.split('_').slice(0, -1).map(Number);
  return DateTime.fromObject(
    { 
      year: fields[0], 
      month: fields[1], 
      day: fields[2],
      hour: fields[3]
    }, 
    { 
      zone: 'utc' 
    }
  );
}

export async function updateFiles(drive: drive_v3.Drive) {
  for (const {name, dataset_id, current_id} of datasets){
    // List files in dataset
    let res = await drive.files.list({
      q: `"${dataset_id}" in parents`,
      fields: 'files(id,name)',
    });
    const dataset = res.data.files;

    // Find current fetchable file
    res = await drive.files.list({
      q: `"${current_id}" in parents`,
      fields: 'files(id,name)',
    });
    const current = res.data.files;

    // Find the timestamp corresponding to the current file
    let currDt = DateTime.fromMillis(0);
    let currId: string = null;
    if (current.length !== 0) {
      currDt = getDateTime(current[0].name);
      currId = current[0].id;
    }

    // Find the smallest timestamp in the dataset that is larger than the current one
    let nextDt = DateTime.fromObject({ year: 2023 });
    let nextId: string = null;
    for (const file of dataset) {
      const datetime = getDateTime(file.name);
      if (datetime > currDt && datetime < nextDt) {
        nextDt = datetime;
        nextId = file.id;
      }
    }

    if (nextId !== null) {
      // Move new fetchable file from "Dataset" folder to "Current" folder
      drive.files.update({
        fileId: nextId,
        addParents: current_id,
        removeParents: dataset_id
      });
      // Move previous fetchable file from "Current" folder to "Dataset" folder
      if (currId !== null) {
        drive.files.update({
          fileId: currId,
          addParents: dataset_id, 
          removeParents: current_id
        })
      };
    };

    console.log(`"${name}" fetchable file updated`);
  }
}