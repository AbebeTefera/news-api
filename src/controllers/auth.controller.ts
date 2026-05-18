import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        Success: false,
        Message: 'Email already exists',
        Object: null,
        Errors: ['Email already registered'],
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(201).json({
      Success: true,
      Message: 'User created successfully',
      Object: user,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Internal server error',
      Object: null,
      Errors: ['Failed to create user'],
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        Success: false,
        Message: 'Invalid credentials',
        Object: null,
        Errors: ['Email or password incorrect'],
      });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        Success: false,
        Message: 'Invalid credentials',
        Object: null,
        Errors: ['Email or password incorrect'],
      });
    }

    const token = generateToken({ sub: user.id, role: user.role });
    return res.status(200).json({
      Success: true,
      Message: 'Login successful',
      Object: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Internal server error',
      Object: null,
      Errors: ['Failed to login'],
    });
  }
};
