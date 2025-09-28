import express from 'express';
import { query } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, requireEditor, AuthRequest } from '../middleware/auth';
import { validateEquipment, validateId, validatePagination } from '../middleware/validation';

const router = express.Router();

// Get all equipment (public)
router.get('/', validatePagination, async (req: any, res: any, next: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const status = req.query.status as string;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (category) {
      whereClause += ` AND category = $${paramIndex++}`;
      queryParams.push(category);
    }

    if (status) {
      whereClause += ` AND status = $${paramIndex++}`;
      queryParams.push(status);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM equipment ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get equipment
    const result = await query(
      `SELECT id, name, description, category, location, image_url, status, created_at, updated_at
       FROM equipment ${whereClause}
       ORDER BY name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    res.json({
      success: true,
      data: {
        equipment: result.rows,
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

// Get single equipment item (public)
router.get('/:id', validateId, async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, description, category, location, image_url, status, created_at, updated_at FROM equipment WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw createError('Equipment not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Get equipment categories (public)
router.get('/categories/list', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT category FROM equipment WHERE category IS NOT NULL ORDER BY category',
      []
    );

    res.json({
      success: true,
      data: result.rows.map((row: any) => row.category),
    });
  } catch (error) {
    next(error);
  }
});

// Create equipment (admin/editor only)
router.post('/', authenticateToken, requireEditor, validateEquipment, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { name, description, category, location, image_url, status = 'available' } = req.body;

    const result = await query(
      `INSERT INTO equipment (name, description, category, location, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, description, category, location, image_url, status, created_at, updated_at`,
      [name, description, category, location, image_url, status]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Update equipment (admin/editor only)
router.put('/:id', authenticateToken, requireEditor, validateId, validateEquipment, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;
    const { name, description, category, location, image_url, status } = req.body;

    // Check if equipment exists
    const existingEquipment = await query('SELECT id FROM equipment WHERE id = $1', [id]);
    if (existingEquipment.rows.length === 0) {
      throw createError('Equipment not found', 404);
    }

    const result = await query(
      `UPDATE equipment 
       SET name = $1, description = $2, category = $3, location = $4, image_url = $5, status = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, name, description, category, location, image_url, status, created_at, updated_at`,
      [name, description, category, location, image_url, status, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Delete equipment (admin/editor only)
router.delete('/:id', authenticateToken, requireEditor, validateId, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM equipment WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw createError('Equipment not found', 404);
    }

    res.json({
      success: true,
      message: 'Equipment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
