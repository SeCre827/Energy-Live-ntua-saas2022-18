import { drive_v3 } from 'googleapis';
import { Readable } from 'stream';

export async function downloadFile(drive: drive_v3.Drive) {
  // Find file to fetch
  const res = await drive.files.list({
    q: `"${process.env.DATA_FETCH_ID}" in parents`,
    fields: 'files(id)',
  });
  const fileId = res.data.files[0].id;

  // Fetch file
  const file = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  });

  // Convert data to Readable stream and return it
  const stream = new Readable();
  stream.push(file.data);
  stream.push(null);
  return stream;
}
