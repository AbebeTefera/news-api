import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  sub: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  if (!env.jwtSecret) {
    console.error('JWT_SECRET is missing');
    return null;
  }
  if (!token || typeof token !== 'string') {
    return null;
  }
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};