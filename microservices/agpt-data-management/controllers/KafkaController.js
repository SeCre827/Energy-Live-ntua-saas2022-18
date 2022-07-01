const { Kafka } = require('kafkajs');
const controllers = require('./AGPTControllers');
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

// Setup an instance of Kafka, depending on the environment (production or development)
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
          mechanism: 'scram-sha-256',
          username: process.env.CLOUDKARAFKA_USERNAME,
          password: process.env.CLOUDKARAFKA_PASSWORD,
        },
      };

const kafka = new Kafka(kafkaClientOptions);

exports.kafkaController = async () => {
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
      process.env.FETCHED_TOPIC, 
      process.env.ADMIN_TOPIC,
    ] 
  });

  // Whenever an event is received by the consumer
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      // Check the topic and message of the event, then continue accordingly if
      // the event is relevant to this microservice
      const value = JSON.parse(message.value);

      if (topic === process.env.FETCHED_TOPIC && value.dataset === 'AGPT') {

        // Download parsed file from Drive
        const id = value.file_id;
        data = await downloadData(drive, id);

        // Import data into database
        await controllers.importData(data.countries_data);

        // Publish a STORED event
        await producer.send({
          topic: process.env.STORED_TOPIC,
          messages: [{
            key: '', 
            value: JSON.stringify({
              dataset: 'AGPT', 
              timestamp: data.timestamp
            })
          }],
        });
      } else if (topic === process.env.ADMIN_TOPIC) {
        if (value.operation === 'RESET') {
          // Reset data in database
          controllers.resetData();
  
          // Publish an ADMIN_RESPONSE event
          await producer.send({
            topic: process.env.ADMIN_RESPONSE_TOPIC,
            messages: [{ 
              key: '', 
              value: JSON.stringify({
                name: 'agpt-data-management',
                reset: 'OK'
              })
            }],
          });
        } else if (value.operation === 'STATUS') {
          // Publish an ADMIN_RESPONSE event
          await producer.send({
            topic: process.env.ADMIN_RESPONSE_TOPIC,
            messages: [{ 
              key: '', 
              value: JSON.stringify({
                name: 'agpt-data-management', 
                status: 'OK'
              }) 
            }],
          });        
        }
      }
    },
  });
};
