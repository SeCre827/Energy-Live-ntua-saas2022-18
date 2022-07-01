import 'dotenv/config';
import { google } from 'googleapis';
import { Kafka } from 'kafkajs';
import { fetchFiles } from './fetchFiles';
import { reset } from './reset';
import { updateFiles } from './updateFiles';
import { status } from './status';
import { resetFiles } from './resetFiles';
import { deleteUploaded } from './deleteUploaded';

/**
 * APACHE KAFKA CONFIGURATION
 */

type mechanismType = 'scram-sha-256';

const kafkaClientOptions =
process.env.NODE_ENV === 'development'
  ? {
      clientId: process.env.CLIENT_ID,
      brokers: [process.env.KAFKA_URI],
    }
  : {
      clientId: process.env.CLIENT_ID,
      brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
      ssl: true,
      sasl: {
        mechanism: <mechanismType>'scram-sha-256',
        username: process.env.CLOUDKARAFKA_USERNAME,
        password: process.env.CLOUDKARAFKA_PASSWORD,
      },
    };

const kafka = new Kafka(kafkaClientOptions);

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`);
      await producer.disconnect();
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  })
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  })
});

/**
 * GOOGLE DRIVE CONFIGURATION
 */

// Service account credential file
const KEYFILEPATH = `${__dirname}/../credentials.json`;

// List of scopes used; 'drive' scope gives full access to Google Drive account
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Initialise GoogleAuth
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Initialise Google Drive service
const drive = google.drive({
  version: 'v3',
  auth: auth,
});

async function main() { 
  switch(process.argv[2]) {
    case 'update_files':
      await updateFiles(drive); break;
    case 'reset_files':
      await resetFiles(drive); break;
    case 'delete_uploaded':
      await deleteUploaded(drive); break;
    case 'fetch_files':
      await fetchFiles(producer); break;
    case 'reset':
      await reset(producer, consumer); break;
    case 'status':
      await status(producer, consumer); break;
    default:
      console.error('Invalid function');
  }
}

main();