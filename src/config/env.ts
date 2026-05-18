import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!, 
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '10000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
};