import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.jwt_key){
    throw new Error('jwt key not defined')
  }
  try{
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Mongodb connected...')
  } catch (err) {
    console.error(err)
  }
  app.listen(9000, () => {
    console.log("listening on port 9000 **LOVE**");
  });
}

start();
