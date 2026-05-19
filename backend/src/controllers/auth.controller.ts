import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest, IUserPayload } from '../types';
import { createError } from '../middleware/errorHandler';

// POST /api/auth/register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };

    const existing = await User.findOne({ email });
    if (existing) {
      sendError(res, 409, 'Email is already registered.');
      return;
    }

    const user = await User.create({ name, email, password, role });

    const payload: IUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = signToken(payload);

    sendSuccess(
      res,
      201,
      'Registration successful.',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // findByEmail includes password field
    const user = await (User as any).findByEmail(email);
    if (!user) {
      sendError(res, 401, 'Invalid email or password.');
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 401, 'Invalid email or password.');
      return;
    }

    const payload: IUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = signToken(payload);

    sendSuccess(res, 200, 'Login successful.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      next(createError('User not found.', 404));
      return;
    }

    sendSuccess(res, 200, 'User retrieved.', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
