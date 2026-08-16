require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

pool.query(`
  SELECT chunk_id, symptom, possible_cause, solution, chunk_text
  FROM knowledge_chunks
  WHERE source = 'manual_Samsung_Refrigerator_RT6300C' AND page = 52;
`).then(res => {
  console.log(JSON.stringify(res.rows, null, 2));
  pool.end();
});