import { MongoMemoryServer } from "mongodb-memory-server";
import request from 'supertest';
import mongoose from "mongoose";
import { app } from "../app";
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../natsWrapper')

let mongo: any;

beforeAll(async () => {
  jest.clearAllMocks();
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

global.signin = (id?: string) => {
const payload = {
  id: id || new mongoose.Types.ObjectId().toHexString(),
  email: 'test@test.com'
}
const token = jwt.sign(payload, process.env.jwt_key!)
const session = { jwt: token }
const sessionJson = JSON.stringify(session)
const base64 = Buffer.from(sessionJson).toString('base64');
return [`express:sess=${base64}`]
}