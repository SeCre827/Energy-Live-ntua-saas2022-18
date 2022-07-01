import { Consumer, Producer } from "kafkajs";
import { wakeup } from "./wakeup";

const ADMIN_TOPIC = 
  process.env.NODE_ENV == 'development' 
  ? process.env.ADMIN_TOPIC_DEV 
  : process.env.ADMIN_TOPIC

const ADMIN_RESPONSE_TOPIC = 
  process.env.NODE_ENV == 'development' 
  ? process.env.ADMIN_RESPONSE_TOPIC_DEV 
  : process.env.ADMIN_RESPONSE_TOPIC

export async function status(producer: Producer, consumer: Consumer) {
  if (process.env.NODE_ENV !== 'deployment') {
    await wakeup();
  }

  // Initialise consumer
  await consumer.connect();
  await consumer.subscribe({
    topic: ADMIN_RESPONSE_TOPIC
  });

  // Run consumer to collect responses from microservices
  await consumer.run({
    eachMessage: async (msg) => {
      const res = <{ name: string, status: string }>JSON.parse(
        msg.message.value.toString()
      );
      console.log(`(*) ${res.name} status: ${res.status}`);
    }
  });

  // Publish STATUS event
  await producer.connect();
  await producer.send({
    topic: ADMIN_TOPIC,
    messages: [{ 
      value: JSON.stringify({ operation: 'STATUS' }) 
    }],
  });
}