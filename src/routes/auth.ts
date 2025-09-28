import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { query } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { handleValidationErrors } from '../middleware/validation';

// Definindo uma interface para o payload do token para uso futuro
interface TokenPayload {
  userId: number;
  username: string;
  role: string;
}

const router = express.Router();

// Validação de Login
const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Validação de Registro
const validateRegister = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').trim().isLength({ min: 1, max: 100 }).withMessage('Full name is required'),
  handleValidationErrors,
];


//====================
// ENDPOINT DE LOGIN
//====================
router.post('/login', validateLogin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const result = await query(
      'SELECT id, username, email, password_hash, role, full_name FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return next(createError('Invalid credentials', 401));
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return next(createError('Invalid credentials', 401));
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('ERRO FATAL: JWT_SECRET não foi definido no arquivo .env');
      throw new Error('A configuração do servidor está incompleta.');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        role: user.role 
      } as TokenPayload,
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
        },
      },
    });

  } catch (error) {
    next(error);
  }
});


//=======================
// ENDPOINT DE REGISTRO
//=======================
router.post('/register', validateRegister, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, fullName, role = 'admin' } = req.body;

    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return next(createError('User already exists', 409));
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      'INSERT INTO users (username, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, full_name',
      [username, email, passwordHash, fullName, role]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          fullName: newUser.full_name,
        },
      },
    });

  } catch (error) {
    next(error);
  }
});


//========================
// ENDPOINT DE VERIFICAÇÃO
//========================
router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return next(createError('No token provided', 401));
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('ERRO FATAL: JWT_SECRET não foi definido no arquivo .env');
      throw new Error('A configuração do servidor está incompleta.');
    }

    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    
    const result = await query(
      'SELECT id, username, email, role, full_name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return next(createError('User not found', 401));
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;