import express from 'express';
import dotenv from 'dotenv';

// routes
import { userRoutes } from './routes/user';

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('EVO RADI NODE + EXPRESS APP !');
  console.log('pdasdfasfsadfads');
});

app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(
    `Social Media app from Marko and Uros at http://localhost:${port}`
  );
});

/**
 *  1. Prvo pravim Prismu i modele za ceo app pocevsi od Usera
 *  2. Prvo User Model => controller => rute => middleware koji hvata
 */

// https://github.com/microsoft/TypeScript-Node-Starter/blob/master/.eslintrc
