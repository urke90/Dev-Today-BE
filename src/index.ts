import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('EVO RADI NODE + EXPRESS APP !');
  console.log('pdasdfasfsadfads');
});

app.listen(port, () => {
  console.log(
    `Social Media app from Marko and Uros at http://localhost:${port}`
  );
});
