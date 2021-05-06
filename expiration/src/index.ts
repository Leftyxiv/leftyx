import { natsWrapper } from './natsWrapper';




const start = async () => {

  if (!process.env.NATS_URL) {
    throw new Error("nats_url must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("nats client id must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("nats cluster id must be defined");
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    natsWrapper.client.on("close", () => {
      console.log("nats connection closed");
      // @ts-ignore
      process.exit();
    });

  // @ts-ignore
  process.on("SIGNINT", () => natsWrapper.client.close());
  // @ts-ignore
  process.on("SIGTERM", () => natsWrapper.client.close());
  
  } catch (err) {
    
  }

 
};

start();
