import type { Request } from 'express';

import express from 'express';

export const userRoutes = express.Router();

userRoutes.get('/', (req, res, next) => {
  console.log('This should be /api/users/ route');

  console.log('req BODY', req.body);

  res.status(200).json({
    userId: 'RADI POSTMAN',
  });
});

userRoutes.get('/:id', (req, res) => {
  console.log('This should be /api/users/123123 route');
  const userId = req.params.id;
  console.log('userId', userId);

  res.json({ userId });
});

userRoutes.post('/', (req, res) => {
  console.log('req U POSU', req.body);

  res.send('Pogodjena post ruta /api/user');
});
