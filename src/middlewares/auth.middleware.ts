import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      Success: false,
      Message: 'Unauthorized',
      Object: null,
      Errors: ['Missing or invalid token'],
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      Success: false,
      Message: 'Unauthorized',
      Object: null,
      Errors: ['Missing or invalid token'],
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      Success: false,
      Message: 'Unauthorized',
      Object: null,
      Errors: ['Invalid or expired token'],
    });
  }

  (req as any).user = { id: payload.sub, role: payload.role };
  next();
};
