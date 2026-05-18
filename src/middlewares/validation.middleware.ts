import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          Success: false,
          Message: 'Validation failed',
          Object: null,
          Errors: error.issues.map((e: { message: string }) => e.message),
        });
      }
      next(error);
    }
  };
};