import { Producer } from 'kafkajs';

export async function fetchFiles(producer: Producer) {
  await producer.connect();
  await producer.send({
    topic: process.env.FETCH_DATA_TOPIC,
    messages: [{ value: '' }],
  });
}