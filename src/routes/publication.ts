import express from 'express';
import { query } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, requireEditor, AuthRequest } from '../middleware/auth';
import { validatePublication, validateId, validatePagination } from '../middleware/validation';

const router = express.Router();

// Get all publications (public)
router.get('/', validatePagination, async (req: any, res: any, next: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;
    const category = req.query.category as string;
    const year = req.query.year as string;
    const search = req.query.search as string;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE status = $1';
    const queryParams: any[] = ['published'];
    let paramIndex = 2;

    if (type) {
      whereClause += ` AND type = $${paramIndex++}`;
      queryParams.push(type);
    }

    if (category) {
      whereClause += ` AND category = $${paramIndex++}`;
      queryParams.push(category);
    }

    if (year) {
      whereClause += ` AND year = $${paramIndex++}`;
      queryParams.push(parseInt(year));
    }

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR authors ILIKE $${paramIndex} OR abstract ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM publications ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get publications
    const result = await query(
      `SELECT id, title, authors, abstract, year, type, category, file_url, doi, created_at, updated_at
       FROM publications ${whereClause}
       ORDER BY year DESC, title ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    res.json({
      success: true,
      data: {
        publications: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single publication (public)
router.get('/:id', validateId, async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, title, authors, abstract, year, type, category, file_url, doi, created_at, updated_at FROM publications WHERE id = $1 AND status = $2',
      [id, 'published']
    );

    if (result.rows.length === 0) {
      throw createError('Publication not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Get publication types (public)
router.get('/types/list', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT type FROM publications WHERE status = $1 ORDER BY type',
      ['published']
    );

    res.json({
      success: true,
      data: result.rows.map((row: any) => row.type),
    });
  } catch (error) {
    next(error);
  }
});

// Get publication categories (public)
router.get('/categories/list', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT category FROM publications WHERE status = $1 AND category IS NOT NULL ORDER BY category',
      ['published']
    );

    res.json({
      success: true,
      data: result.rows.map((row: any) => row.category),
    });
  } catch (error) {
    next(error);
  }
});

// Get publication years (public)
router.get('/years/list', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT year FROM publications WHERE status = $1 ORDER BY year DESC',
      ['published']
    );

    res.json({
      success: true,
      data: result.rows.map((row: any) => row.year),
    });
  } catch (error) {
    next(error);
  }
});

// Create publication (admin/editor only)
router.post('/', authenticateToken, requireEditor, validatePublication, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { title, authors, abstract, year, type, category, file_url, doi } = req.body;

    const result = await query(
      `INSERT INTO publications (title, authors, abstract, year, type, category, file_url, doi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, authors, abstract, year, type, category, file_url, doi, created_at, updated_at`,
      [title, authors, abstract, year, type, category, file_url, doi]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Update publication (admin/editor only)
router.put('/:id', authenticateToken, requireEditor, validateId, validatePublication, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;
    const { title, authors, abstract, year, type, category, file_url, doi } = req.body;

    // Check if publication exists
    const existingPublication = await query('SELECT id FROM publications WHERE id = $1', [id]);
    if (existingPublication.rows.length === 0) {
      throw createError('Publication not found', 404);
    }

    const result = await query(
      `UPDATE publications 
       SET title = $1, authors = $2, abstract = $3, year = $4, type = $5, category = $6, file_url = $7, doi = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, title, authors, abstract, year, type, category, file_url, doi, created_at, updated_at`,
      [title, authors, abstract, year, type, category, file_url, doi, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Delete publication (admin/editor only)
router.delete('/:id', authenticateToken, requireEditor, validateId, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM publications WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw createError('Publication not found', 404);
    }

    res.json({
      success: true,
      message: 'Publication deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
