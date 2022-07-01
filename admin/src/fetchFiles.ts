import { Producer } from 'kafkajs';
import { wakeup } from './wakeup';

const ADMIN_TOPIC = 
  process.env.NODE_ENV == 'development' 
  ? process.env.ADMIN_TOPIC_DEV 
  : process.env.ADMIN_TOPIC

export async function fetchFiles(producer: Producer) {
  if (process.env.NODE_ENV !== 'deployment') {
    await wakeup();
  }
  
  await producer.connect();
  await producer.send({
    topic: ADMIN_TOPIC,
    messages: [{ 
      value: JSON.stringify({ operation: 'FETCH' })
    }],
  });
}