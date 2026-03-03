import mysql from 'mysql2/promise';

export const pool = mysql.createPool(process.env.DATABASE_URL || '');

// Inicializa a tabela caso não exista
await pool.query(`
  CREATE TABLE IF NOT EXISTS pastes (
    id VARCHAR(50) PRIMARY KEY,
    content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
  )
`);

export interface Paste {
  id: string;
  content: string;
  language: string;
  created_at: string;
}

export async function insertPaste(id: string, content: string, language: string): Promise<Paste> {
  await pool.query(
    'INSERT INTO pastes (id, content, language) VALUES (?, ?, ?)',
    [id, content, language]
  );
  const result = await getPasteById(id);
  return result as Paste;
}

export async function getAllPastes(): Promise<Paste[]> {
  const [rows] = await pool.query('SELECT * FROM pastes ORDER BY created_at DESC');
  return rows as Paste[];
}

export async function getPasteById(id: string): Promise<Paste | undefined> {
  const [rows] = await pool.query('SELECT * FROM pastes WHERE id = ?', [id]);
  const pastes = rows as Paste[];
  return pastes.length > 0 ? pastes[0] : undefined;
}

export async function updatePasteById(id: string, content: string, language: string): Promise<Paste | undefined> {
  await pool.query(
    'UPDATE pastes SET content = ?, language = ? WHERE id = ?',
    [content, language, id]
  );
  return await getPasteById(id);
}

export async function deletePasteById(id: string): Promise<void> {
  await pool.query('DELETE FROM pastes WHERE id = ?', [id]);
}
