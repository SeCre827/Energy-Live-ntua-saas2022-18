import { Consumer, Producer } from "kafkajs";

export async function status(producer: Producer, consumer: Consumer) {
  // Initialise consumer
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.STATUS_RESPONSE_TOPIC
  });

  // Run consumer to collect responses from microservices
  await consumer.run({
    eachMessage: async (msg) => {
      const res = <{ name: string, status: string }>JSON.parse(msg.message.value.toString());
      console.log(`(*) ${res.name} status: ${res.status}`);
    }
  });

  // Publish STATUS event
  await producer.connect();
  await producer.send({
    topic: process.env.STATUS_TOPIC,
    messages: [{ value: '' }],
  });
}