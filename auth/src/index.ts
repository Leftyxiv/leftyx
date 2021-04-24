import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('Hallo, wunderbar')
})

app.listen(9000, ()=> {
  console.log('listening on port 9000 ***LOVE***')
})