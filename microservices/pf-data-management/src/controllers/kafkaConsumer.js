const { Kafka } = require('kafkajs');
const controllers = require('./pfControllers');
const { google } = require('googleapis');

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
  brokers: [process.env.KAFKA_URI],
});

kafkaController = async () => {
  // Initialise Google Drive service
  const drive = await initDrive();

  // Initialise a producer
  const producer = kafka.producer();
  await producer.connect();

  // Initialise a consumer
  const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ 
    topics: [
      process.env.FETCH_TOPIC, 
      process.env.RESET_TOPIC, 
      process.env.STATUS_TOPIC
    ] 
  });

  // Whenever an event is received by the consumer
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      // Check in which topic the received message belongs, then continue appropriately
      if (topic === process.env.FETCH_TOPIC) {
        // Download parsed file from Drive
        const id = JSON.parse(message.value).id;
        data = await downloadData(drive, id);

        // Import data into database
        await controllers.updateData2(data);

        // Publish a STORED_AGPT event
        await producer.send({
          topic: process.env.STORED_TOPIC,
          messages: [{ key: '', value: JSON.stringify({timestamp: data.timestamp}) }],
        });
      } else if (topic === process.env.RESET_TOPIC) {
        // Reset data in database
        controllers.resetDB();

        // Publish a RESET_RESPONSE event
        await producer.send({
          topic: process.env.RESET_RESPONSE_TOPIC,
          messages: [{ key: '', value: JSON.stringify({name: 'pf-data-management'}) }],
        });
      } else if (topic === process.env.STATUS_TOPIC) {
        // Publish a STATUS_RESPONSE event
        await producer.send({
          topic: process.env.STATUS_RESPONSE_TOPIC,
          messages: [{ key: '', value: JSON.stringify({name: 'pf-data-management', status: 'OK'}) }],
        });        
      }
    },
  });
};

module.exports = kafkaController;
