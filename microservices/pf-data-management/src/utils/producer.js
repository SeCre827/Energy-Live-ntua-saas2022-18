const { Kafka } = require('kafkajs');

// the client ID lets kafka know who's producing the messages
const clientId = process.env.GROUP_ID;
// we can define the list of brokers in the cluster
const brokers = [process.env.KAFKA_URI];
// this is the topic to which we want to write messages

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({
  clientId: clientId,
  brokers: brokers,
});
const producer = kafka.producer();

// we define an async function that writes a new message each second
const produce = async (giventimestamp) => {
  await producer.connect();
  await producer.send({
    topic: process.env.NEW_DATA_TOPIC,
    messages: [{ key: '', value: `{"timestamp":${giventimestamp}}` }],
  });
};

module.exports = produce;
