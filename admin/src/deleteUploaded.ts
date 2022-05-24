import { drive_v3 } from "googleapis";

const filehost = [
  {
    name: "ActualTotalLoad",
    filehost_id: process.env.ATL_FILEHOST_ID,
  },
  {
    name: "AggrGenerationPerType",
    filehost_id: process.env.AGPT_FILEHOST_ID,
  },
  {
    name: "PhysicalFlows",
    filehost_id: process.env.PF_FILEHOST_ID,
  },
];

export async function deleteUploaded(drive: drive_v3.Drive) {
  for (const { name, filehost_id } of filehost) {
    // List files in filehost
    let res = await drive.files.list({
      q: `"${filehost_id}" in parents`,
      fields: 'files(id)',
    });
    const files = res.data.files;

    // Delete all files
    for (const { id } of files) {
      await drive.files.delete({
        fileId: id
      });
    }

    console.log(`${name} filehost: deleted all uploaded files`);
  }
}