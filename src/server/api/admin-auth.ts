import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { adminAuthMiddleware, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET } from '../middleware/admin-auth';

const router = express.Router();

/**
 * POST /api/admin/auth/login
 * Authenticate admin user with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password with hash
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (24 hour expiry)
    const token = jwt.sign(
      {
        admin: true,
        email: ADMIN_EMAIL,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: '24h',
        algorithm: 'HS256',
      }
    );

    // Set as httpOnly cookie (not accessible by JavaScript for security)
    res.cookie('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/api',
    });

    // Calculate expiry time
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);

    return res.json({
      success: true,
      message: 'Login successful',
      expiresAt: expiryTime.toISOString(),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/admin/auth/verify
 * Verify current session is valid
 */
router.get('/verify', adminAuthMiddleware, (req: Request, res: Response) => {
  return res.json({
    success: true,
    admin: req.admin,
  });
});

/**
 * POST /api/admin/auth/logout
 * Clear admin session
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_session', { path: '/api' });
  return res.json({ success: true, message: 'Logged out' });
});

export default router;
