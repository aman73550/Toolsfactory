import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Admin credentials from environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'owsmboy7383@gmail.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$dPz1O5h.VX92kQ8DvzQSt.hWPfRvPRp5fG2kM7m9p8w9kQ8DvzQSt'; // bcrypt hash of "Aman@73550"
const JWT_SECRET = process.env.JWT_SECRET || 'toolsfactory-admin-secret-2024';

declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}

export async function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.admin_session;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
}

export { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET };
