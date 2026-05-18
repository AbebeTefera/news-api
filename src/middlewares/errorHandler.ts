import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    Success: false,
    Message: 'Internal server error',
    Object: null,
    Errors: ['An unexpected error occurred'],
  });
};
