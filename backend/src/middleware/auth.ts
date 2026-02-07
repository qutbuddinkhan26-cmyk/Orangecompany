import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

const extractBearerToken = (authHeader?: string) => {
  if (!authHeader) {
    return null;
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }
  return token;
};

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const userId = decoded.id || decoded.userId;
    const role = decoded.role;

    if (!userId || !role) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    req.user = { id: String(userId), role: String(role) };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized to access this resource' });
    return;
  }

  next();
};
