import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const signToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, JWT_SECRET) as IUserPayload;
};
