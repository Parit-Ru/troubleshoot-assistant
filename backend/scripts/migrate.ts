import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // 1. Ensure tracking table exists (idempotent, safe to always run)
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // relies on numeric filename prefixes (0001_, 0002_, ...)

  const client = await pool.connect();

  try {
    // Bootstrap: run the very first file unconditionally if the tracking table doesn't exist yet
    for (const file of files) {
      const alreadyApplied = await client
        .query('SELECT 1 FROM schema_migrations WHERE filename = $1', [file])
        .catch(() => null); // tracking table might not exist on the very first run

      if (alreadyApplied && (alreadyApplied.rowCount ?? 0) > 0) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      console.log(`Applying ${file}...`);

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING',
          [file],
        );
        await client.query('COMMIT');
        console.log(`✔ ${file} applied`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations()
  .then(() => {
    console.log('All migrations complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });