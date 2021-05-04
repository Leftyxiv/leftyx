
import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from './natsWrapper';

import { TicketUpdatedListener } from './events/listeners/ticketUpdatedListener';
import { TicketCreatedListener } from './events/listeners/ticketCreatedListener';


const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt key not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("mongo_uri must be defined");
  }
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
  
  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();



    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Mongodb connected...");
  } catch (err) {
    console.error(err);
  }
  app.listen(9000, () => {
    console.log("listening on port 9000 **LOVE**");
  });
};

start();
