// server/utils/db.ts
import { Pool } from 'pg';

// Garante que a string de conexão exista, senão falha com erro claro
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // De propósito: erro explícito para ambiente mal configurado,
  // em vez da mensagem genérica do driver PG.
  throw new Error(
    'DATABASE_URL não está configurada. ' +
    'Crie um arquivo .env na raiz do projeto com, por exemplo:\n' +
    'DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco'
  );
}

const pool = new Pool({ connectionString });

export const query = (text: string, params?: any[]) => pool.query(text, params);