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

// used to parse incoming requests with JSON payload
app.use(express.json());
// used for CORS, to enable domains from which server can be interacted
app.use(cors(CORS_CONFIG));

app.use('/api/user', userRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Social Media app from Marko and Uros at http://localhost:${port}`
  );
});
