import { Consumer, Producer } from 'kafkajs';
import { wakeup } from './wakeup';

export async function reset(producer: Producer, consumer: Consumer) {
  await wakeup();

  // Initialise consumer
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.ADMIN_RESPONSE_TOPIC
  });

  // Run consumer to collect responses from microservices
  await consumer.run({
    eachMessage: async (msg) => {
      const res = <{ name: string; reset: string }>JSON.parse(
        msg.message.value.toString()
      );
      console.log(`(*) ${res.name} reset: ${res.reset}`);
    }
  });

  // Publish RESET event
  await producer.connect();
  await producer.send({
    topic: process.env.ADMIN_TOPIC,
    messages: [{ 
      value: JSON.stringify({ operation: 'RESET' }) 
    }],
  });
}