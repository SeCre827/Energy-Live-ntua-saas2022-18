const { Kafka } = require('kafkajs');
const controllers = require('./agptControllers');
const { google } = require('googleapis');
const produce = require('../utils/producer');

async function initDrive() {
  // Google Service Account credentials file
  const KEYFILE = './credentials.json';

  // List of scopes used; 'drive' scope gives full access to Google Drive
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

  return drive;
}

async function downloadData(drive, fileId) {
  // Download JSON file
  const json = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  });
  // Return JSON data as object
  return json.data;
}
const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.KAFKA_URI], // [env.get("KAFKA_BOOTSTRAP_SERVER").required().asString()],
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const consumerUpdateData = async () => {
  const drive = await initDrive();
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.FETCH_TOPIC });
  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: async ({ message }) => {
      // console.log(JSON.parse(message.value));
      const id = JSON.parse(message.value).id;
      console.log(id);
      data = await downloadData(drive, id);
      console.log(data.timestamp);
      await controllers.updateData2(data);
      produce(data.timestamp).catch((err) => {
        console.error('error in producer: ', err);
      });
      // here, we just log the message to the standard output
      console.log(`received message: ${message.value}`);
    },
  });
};

module.exports = consumerUpdateData;
