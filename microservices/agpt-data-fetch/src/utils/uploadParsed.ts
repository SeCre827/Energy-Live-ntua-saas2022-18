import { drive_v3 } from 'googleapis';
import { DataDto } from 'src/dto/dataDto';
import { Readable } from 'stream';

export async function uploadParsed(drive: drive_v3.Drive, parsed: DataDto) {
  // Convert object to JSON and then to Readable stream
  const json = JSON.stringify(parsed);
  const stream = new Readable();
  stream.push(json);
  stream.push(null);

  // Upload file
  const file = await drive.files.create({
    media: {
      body: stream,
      mimeType: 'application/json',
    },
    fields: 'id',
    requestBody: {
      name: `${parsed.timestamp}.json`,
      parents: [process.env.DATA_UPLOAD_ID],
    },
  });

  // Return generated file ID
  return file.data;
}
