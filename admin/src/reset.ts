import { Consumer, Producer } from 'kafkajs';

export async function reset(producer: Producer, consumer: Consumer) {
  let count = Number(process.env.RESET_COUNT);

  // Initialise consumer
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.RESET_RESPONSE_TOPIC
  });

  // Run consumer to collect responses from microservices
  await consumer.run({
    eachMessage: async (msg) => {
      const res = <{ name: string }>JSON.parse(msg.message.value.toString());
      console.log(`(*) ${res.name} reset`);
    }
  });

  // Publish RESET event
  await producer.connect();
  await producer.send({
    topic: process.env.RESET_TOPIC,
    messages: [{ value: '' }],
  });
}