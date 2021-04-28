import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt key not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("mongo_uri must be defined");
  }
  try {
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
