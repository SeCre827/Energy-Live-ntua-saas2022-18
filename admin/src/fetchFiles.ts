import { Producer } from 'kafkajs';
import { wakeup } from './wakeup';

export async function fetchFiles(producer: Producer) {
  await wakeup();
  
  await producer.connect();
  await producer.send({
    topic: process.env.ADMIN_TOPIC,
    messages: [{ 
      value: JSON.stringify({ operation: 'FETCH' })
    }],
  });
}