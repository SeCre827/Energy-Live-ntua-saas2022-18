import { drive_v3 } from "googleapis";

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

export async function resetFiles(drive: drive_v3.Drive) {
  for (const {name, dataset_id, current_id} of datasets) {
    // Find current fetchable file
    const res = await drive.files.list({
      q: `"${current_id}" in parents`,
      fields: 'files(id,name)',
    });
    const current = res.data.files;

    // Move it back to the dataset folder
    if (current.length !== 0) {
      drive.files.update({
        fileId: current[0].id,
        addParents: dataset_id,
        removeParents: current_id,
      });
      console.log(`${name} fetchable file reset`);
    } else {
      console.log(`${name} already reset`);
    }
  }
}