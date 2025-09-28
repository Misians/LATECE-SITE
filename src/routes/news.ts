import express from 'express';
import { query } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, requireEditor, AuthRequest } from '../middleware/auth';
import { validateNews, validateNewsUpdate, validateId, validatePagination } from '../middleware/validation';

const router = express.Router();

// Get all news (public)
router.get('/', validatePagination, async (req: any, res: any, next: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string || 'published';
    const featured = req.query.featured as string;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE status = $1';
    const queryParams: any[] = [status];
    let paramIndex = 2;

    if (featured === 'true') {
      whereClause += ` AND featured = true`;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM news ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get news
    const result = await query(
      `SELECT 
        n.id, n.title, n.excerpt, n.status, n.featured, n.image_url,
        n.created_at, n.updated_at, n.published_at,
        u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      ${whereClause}
      ORDER BY n.published_at DESC, n.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    res.json({
      success: true,
      data: {
        news: result.rows,
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

// Get single news item (public)
router.get('/:id', validateId, async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        n.id, n.title, n.content, n.excerpt, n.status, n.featured, n.image_url,
        n.created_at, n.updated_at, n.published_at,
        u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.id = $1 AND n.status = 'published'`,
      [id]
    );

    if (result.rows.length === 0) {
      throw createError('News not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Create news (admin/editor only)
router.post('/', authenticateToken, requireEditor, validateNews, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { title, content, excerpt, status = 'draft', featured = false, image_url } = req.body;
    const authorId = req.user!.id;

    const result = await query(
      `INSERT INTO news (title, content, excerpt, author_id, status, featured, image_url, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, content, excerpt, status, featured, image_url, created_at, updated_at, published_at`,
      [
        title,
        content,
        excerpt,
        authorId,
        status,
        featured,
        image_url,
        status === 'published' ? new Date() : null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Update news (admin/editor only)
router.put('/:id', authenticateToken, requireEditor, validateId, validateNewsUpdate, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, featured, image_url } = req.body;

    // Check if news exists
    const existingNews = await query('SELECT id, status FROM news WHERE id = $1', [id]);
    if (existingNews.rows.length === 0) {
      throw createError('News not found', 404);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(content);
    }
    if (excerpt !== undefined) {
      updates.push(`excerpt = $${paramIndex++}`);
      values.push(excerpt);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
      // Set published_at if status changed to published
      if (status === 'published') {
        updates.push(`published_at = $${paramIndex++}`);
        values.push(new Date());
      }
    }
    if (featured !== undefined) {
      updates.push(`featured = $${paramIndex++}`);
      values.push(featured);
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(image_url);
    }

    if (updates.length === 0) {
      throw createError('No valid fields to update', 400);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE news SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Delete news (admin/editor only)
router.delete('/:id', authenticateToken, requireEditor, validateId, async (req: AuthRequest, res: any, next: any) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw createError('News not found', 404);
    }

    res.json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
