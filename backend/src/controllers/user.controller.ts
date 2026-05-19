import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

// GET /api/users  (admin: list all users)
export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password').lean();
    sendSuccess(res, 200, 'Users retrieved.', users);
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }
    sendSuccess(res, 200, 'User retrieved.', user);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id  (admin only)
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.id === req.params.id) {
      sendError(res, 400, 'You cannot delete your own account.');
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    sendSuccess(res, 200, 'User deleted successfully.');
  } catch (error) {
    next(error);
  }
};
