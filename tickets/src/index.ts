import mongoose from "mongoose";
import { nanoid } from 'nanoid'

import { app } from "./app";
import { natsWrapper } from './natsWrapper';


const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt key not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("mongo_uri must be defined");
  }
  try {
    await natsWrapper.connect('leftyx', nanoid(), 'http://nats-srv:4222');

    natsWrapper.client.on("close", () => {
      console.log("nats connection closed");
      // @ts-ignore
      process.exit();
    });

  // @ts-ignore
  process.on("SIGNINT", () => natsWrapper.client.close());
  // @ts-ignore
  process.on("SIGTERM", () => natsWrapper.client.close());
  



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
