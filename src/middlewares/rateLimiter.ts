import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import { env } from '../config/env';

export const readSpamLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.id;
  const userId = (req as any).user?.id || req.ip;
  const key = `rate_limit:read:${articleId}:${userId}`;

  try {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, Math.ceil(env.rateLimit.windowMs / 1000));
    }

    if (current > env.rateLimit.max) {
      return res.status(429).json({
        Success: false,
        Message: 'Too many read requests. Please slow down.',
        Object: null,
        Errors: ['Rate limit exceeded for reading this article'],
      });
    }
    next();
  } catch (error) {
    next(); // fallback: allow request
  }
};
