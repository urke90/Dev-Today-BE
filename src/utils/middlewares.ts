import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

// ----------------------------------------------------------------

/**
 * @type {function} ZOD validator for user routes.
 */
export const validateUserReqBody =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const bodyValidation = schema.safeParse(req.body);

    if (!bodyValidation.success && bodyValidation.error instanceof z.ZodError) {
      const validationError = bodyValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };
