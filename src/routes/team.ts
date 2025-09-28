import express from 'express';
import { query } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, requireEditor, AuthRequest } from '../middleware/auth';
import { validateTeamMember, validateId, validatePagination } from '../middleware/validation';

const router = express.Router();

// Get all team members (public)
router.get('/', validatePagination, async (req: any, res: any, next: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const active = req.query.active as string;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (active !== undefined) {
      whereClause += ` AND active = $${paramIndex++}`;
      queryParams.push(active === 'true');
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM team ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get team members
    const result = await query(
      `SELECT id, name, role, bio, email, image_url, order_index, active, created_at, updated_at
       FROM team ${whereClause}
       ORDER BY order_index ASC, name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    res.json({
      success: true,
      data: {
        team: result.rows,
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

// Get single team member (public)
router.get('/:id', validateId, async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, role, bio, email, image_url, order_index, active, created_at, updated_at FROM team WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw createError('Team member not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Create team member (admin/editor only)
router.post('/', authenticateToken, requireEditor, validateTeamMember, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { name, role, bio, email, image_url, order_index = 0, active = true } = req.body;

    const result = await query(
      `INSERT INTO team (name, role, bio, email, image_url, order_index, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, role, bio, email, image_url, order_index, active, created_at, updated_at`,
      [name, role, bio, email, image_url, order_index, active]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Update team member (admin/editor only)
router.put('/:id', authenticateToken, requireEditor, validateId, validateTeamMember, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;
    const { name, role, bio, email, image_url, order_index, active } = req.body;

    // Check if team member exists
    const existingMember = await query('SELECT id FROM team WHERE id = $1', [id]);
    if (existingMember.rows.length === 0) {
      throw createError('Team member not found', 404);
    }

    const result = await query(
      `UPDATE team 
       SET name = $1, role = $2, bio = $3, email = $4, image_url = $5, order_index = $6, active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, name, role, bio, email, image_url, order_index, active, created_at, updated_at`,
      [name, role, bio, email, image_url, order_index, active, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Delete team member (admin/editor only)
router.delete('/:id', authenticateToken, requireEditor, validateId, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM team WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw createError('Team member not found', 404);
    }

    res.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
