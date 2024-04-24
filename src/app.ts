import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { z } from 'zod';
import { errorMap } from 'zod-validation-error';

import { CORS_CONFIG } from '@/config';
import { userRoutes } from '@/routes/user';

// ----------------------------------------------------------------

const app = express();
dotenv.config();
z.setErrorMap(errorMap);

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors(CORS_CONFIG));

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
