import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const sql = `
    SELECT DISTINCT category
    FROM equipment
    WHERE category IS NOT NULL AND category <> ''
    ORDER BY category ASC
  `

  const result = await query(sql)

  return result.rows.map((row) => row.category as string)
})

