import express from 'express';
import dotenv from 'dotenv';

// routes
import { userRoutes } from '@/routes/user';
import { ZodError, fromZodError, errorMap } from 'zod-validation-error';
import cors from 'cors';
import { z } from 'zod';

z.setErrorMap(errorMap);

// ----------------------------------------------------------------

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/user', userRoutes);

// @ts-ignore
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    const validationError = err.errors.map((error) => ({
      type: 'manual',
      name: error.path[0],
      message: error.message,
    }));

    return res.status(400).json(validationError);
  }

  res.status(500).json({ message: 'An unknown error occured.' });
});

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
