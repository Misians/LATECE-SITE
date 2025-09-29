import { query } from '~/server/utils/db';
import type { News, NewsFilters, NewsStatus } from '~/types/news';

// Usamos Partial<News> para a atualização, pois nem todos os campos são enviados
type NewsUpdatePayload = Partial<Omit<News, 'id' | 'createdAt' | 'updatedAt'>>;
type NewsCreatePayload = Omit<News, 'id' | 'createdAt' | 'updatedAt'>;

export const newsService = {
  /**
   * Busca uma lista de notícias com filtros e paginação
   */
  async findMany(filters: NewsFilters, pagination: { page: number, limit: number }) {
    const { status, featured, search } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    
    let whereClauses = [];
    let params = [];
    let paramIndex = 1;

    if (status) {
      whereClauses.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    if (featured !== undefined) {
      whereClauses.push(`featured = $${paramIndex++}`);
      params.push(featured);
    }
    if (search) {
      whereClauses.push(`title ILIKE $${paramIndex++}`); // ILIKE para busca case-insensitive
      params.push(`%${search}%`);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Query para obter o total de itens (para a paginação)
    const totalQuery = `SELECT COUNT(*) FROM news ${whereString}`;
    const totalResult = await query(totalQuery, params);
    const total = parseInt(totalResult.rows[0].count, 10);
    
    // Query para obter os itens da página atual
    const dataQuery = `
      SELECT * FROM news 
      ${whereString} 
      ORDER BY id DESC 
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    const dataResult = await query(dataQuery, [...params, limit, offset]);

    return {
      news: dataResult.rows as News[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    };
  },

  /**
   * Busca uma notícia pelo ID
   */
  async findById(id: number): Promise<News | null> {
    const result = await query('SELECT * FROM news WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Cria uma nova notícia
   */
  async create(data: NewsCreatePayload): Promise<News> {
    const { title, content, excerpt, imageUrl, status, category, featured, tags } = data;
    const sql = `
      INSERT INTO news (title, content, excerpt, "imageUrl", status, category, featured, tags) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    const params = [title, content, excerpt, imageUrl, status, category, featured, tags || []];
    const result = await query(sql, params);
    return result.rows[0];
  },

  /**
   * Atualiza uma notícia existente
   */
  async update(id: number, data: NewsUpdatePayload): Promise<News | null> {
    const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
    if (fields.length === 0) {
      return this.findById(id); // Se não há nada a atualizar, retorna o item atual
    }
    
    const setClause = fields.map((field, index) => `"${field}" = $${index + 2}`).join(', ');
    const params = [id, ...fields.map(field => (data as any)[field])];
    
    const sql = `UPDATE news SET ${setClause}, "updatedAt" = NOW() WHERE id = $1 RETURNING *`;
    const result = await query(sql, params);
    return result.rows[0] || null;
  },
  
  /**
   * Deleta uma notícia pelo ID
   */
  async remove(id: number): Promise<boolean> {
    const result = await query('DELETE FROM news WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};