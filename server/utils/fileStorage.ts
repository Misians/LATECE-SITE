// server/utils/fileStorage.ts

import { promises as fs } from 'fs'
import { resolve } from 'path'

// Define o caminho base para a pasta de uploads pública
const UPLOAD_DIR = resolve(process.cwd(), 'public/uploads')

/**
 * Garante que o diretório de uploads exista.
 */
async function ensureUploadDirExists() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    console.error('Erro ao criar o diretório de uploads:', error)
    throw new Error('Não foi possível criar o diretório de armazenamento.')
  }
}

/**
 * Salva um arquivo no sistema de arquivos local.
 * @param fileBuffer O conteúdo do arquivo em formato Buffer.
 * @param fileName O nome original do arquivo.
 * @returns A URL pública para acessar o arquivo (ex: /uploads/arquivo.jpg).
 */
export async function saveFile(fileBuffer: Buffer, fileName: string): Promise<string> {
  await ensureUploadDirExists()

  // Gera um nome de arquivo único para evitar sobreposições
  const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`
  const filePath = resolve(UPLOAD_DIR, uniqueFileName)

  try {
    await fs.writeFile(filePath, fileBuffer)
    // Retorna a URL pública, não o caminho do sistema de arquivos
    return `/uploads/${uniqueFileName}`
  } catch (error) {
    console.error(`Erro ao salvar o arquivo "${uniqueFileName}":`, error)
    throw new Error('Falha ao salvar o arquivo no servidor.')
  }
}

/**
 * Deleta um arquivo do sistema de arquivos local.
 * @param fileUrl A URL pública do arquivo (ex: /uploads/arquivo.jpg).
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return

  try {
    // Converte a URL pública de volta para um caminho de sistema de arquivos
    const fileName = fileUrl.split('/').pop()
    if (!fileName) return

    const filePath = resolve(UPLOAD_DIR, fileName)
    
    // Verifica se o arquivo existe antes de tentar deletar
    await fs.access(filePath)
    await fs.unlink(filePath)
  } catch (error) {
    // Se o arquivo não existir (fs.access falhar), não há problema.
    // Para outros erros, apenas logamos, pois a deleção do DB é mais importante.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Falha ao deletar o arquivo local em "${fileUrl}":`, error)
    }
  }
}