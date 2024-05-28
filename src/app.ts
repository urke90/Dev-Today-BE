import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { z } from 'zod';
import { errorMap } from 'zod-validation-error';

import { CORS_CONFIG } from '@/config';
import { contentRoutes } from '@/routes/content';
import { groupRoutes } from '@/routes/group';
import { userRoutes } from '@/routes/user';

// ----------------------------------------------------------------

const app = express();
dotenv.config();
z.setErrorMap(errorMap);

// used to parse incoming requests with JSON payload
app.use(express.json());
// used for CORS, to enable domains from which server can be interacted
app.use(cors(CORS_CONFIG));

app.use('/api/groups', groupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/content', contentRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Social Media app from Marko and Uros at http://localhost:${port}`
  );
});
