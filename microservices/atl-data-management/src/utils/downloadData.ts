import { google } from 'googleapis';
import { DataDto } from 'src/input/data-dto.input';

export async function downloadData(fileId: string): Promise<DataDto> {
  // Google Service Account credentials file
  const KEYFILE = './credentials.json';

  // List of scopes used; 'drive' scope gives full access to Google Drive account
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  // Initialise GoogleAuth
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE,
    scopes: SCOPES,
  });

  // Initialise Google Drive service
  const drive = google.drive({
    version: 'v3',
    auth: auth,
  });

  // Download JSON file
  const json = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  });

  // Return JSON data as object
  return <DataDto>json.data;
}
