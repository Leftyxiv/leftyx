import { MongoMemoryServer } from "mongodb-memory-server";
import request from 'supertest';
import mongoose from "mongoose";
import { app } from "../app";
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.jwt_key = "thisismysupersecretnotsosecretteststring";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
const payload = {
  id: '34534sredex',
  email: 'test@test.com'
}
const token = jwt.sign(payload, process.env.jwt_key!)
const session = { jwt: token }
const sessionJson = JSON.stringify(session)
const base64 = Buffer.from(sessionJson).toString('base64');
return [`express:sess=${base64}`]
}