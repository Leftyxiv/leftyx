import express from 'express';

const app = express();
app.use(express.json());

app.listen(9000, ()=> {
  console.log('listening on port 9000')
})