import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message =
    err.isOperational ? err.message : 'Internal server error.';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  sendError(res, statusCode, message);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found.`);
};

export const createError = (
  message: string,
  statusCode: number
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
