import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { google } from 'googleapis';
import { downloadFile } from './utils/downloadFile';
import { messageLog } from './utils/messageLog';
import { parseFile } from './utils/parseFile';
import { uploadParsed } from './utils/uploadParsed';

@Injectable()
export class AppService {
  constructor(@Inject('KAFKA') private readonly client: ClientKafka) {}

  async fetchFile() {
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

    // Fetch file, parse it, then upload parsed file to drive
    const fetched = await downloadFile(drive);
    const parsed = await parseFile(fetched);
    const uploaded = await uploadParsed(drive, parsed);

    // Publish FETCHED event
    this.client.emit(process.env.FETCHED_TOPIC, {
      dataset: 'AGPT',
      file_id: uploaded.id,
    });
    messageLog('Uploaded parsed JSON file');
  }

  status() {
    this.client.emit(process.env.ADMIN_RESPONSE_TOPIC, {
      name: 'agpt-data-fetch',
      status: 'OK',
    });
  }
}
