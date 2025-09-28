// server/api/news/[id].get.ts

import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Log 1: Verifica se o arquivo da API foi acionado
  console.log('\n--- DEBUG: Requisição recebida em /api/news/[id].get.ts ---')

  const newsId = parseInt(getRouterParam(event, 'id') as string)
  // Log 2: Mostra o ID que foi extraído da URL
  console.log(`[PASSO 2] ID extraído da URL: ${newsId}`)

  if (isNaN(newsId)) {
    console.log('[ERRO PASSO 2] O ID não é um número válido. Retornando erro 400.')
    throw createError({
      statusCode: 400,
      statusMessage: 'O ID da notícia deve ser um número.',
    })
  }

  // Log 3: Mostra a consulta SQL exata que será executada
  const sqlQuery = "SELECT * FROM news WHERE id = $1 AND status = 'published'"
  console.log(`[PASSO 3] Executando a seguinte consulta SQL:`)
  console.log(sqlQuery)
  console.log(`           com o parâmetro: [${newsId}]`)

  const result = await query(sqlQuery, [newsId])
  
  // Log 4: Mostra quantas linhas o banco de dados retornou para essa consulta
  console.log(`[PASSO 4] O banco de dados retornou ${result.rows.length} linha(s).`)

  if (result.rows.length === 0) {
    console.log('[ERRO PASSO 4] Nenhuma linha encontrada. Retornando erro 404.')
    throw createError({
      statusCode: 404,
      statusMessage: 'Notícia não encontrada.',
    })
  }

  // Log 5: Se encontrou, mostra os dados da notícia
  console.log('[PASSO 5] Sucesso! Notícia encontrada. Retornando dados:')
  console.log(result.rows[0])
  
  return result.rows[0]
})