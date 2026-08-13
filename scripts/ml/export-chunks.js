/**
 * export-chunks.js — Phase 12: Export knowledge_chunks to JSON
 * ================================================================
 * Uses raw `pg`, matching your actual stack (no Prisma).
 *
 * SETUP:
 *   npm install pg          (if not already a dependency in your backend repo)
 *
 * USAGE:
 *   Run from your backend repo root, where DATABASE_URL is already
 *   configured (e.g. in your .env), or set it inline:
 *
 *   DATABASE_URL="postgres://user:pass@host:port/dbname" node export-chunks.js
 *
 * OUTPUT:
 *   knowledge_chunks.json — written to the current directory.
 *   Copy this file next to generate_training_data.py for Phase 13.
 *
 * IMPORTANT — CHECK YOUR ACTUAL COLUMN NAMES BEFORE RUNNING:
 *   This assumes snake_case columns matching the original schema doc:
 *   device, brand, model, category, symptom, possible_cause, solution,
 *   severity, difficulty, estimated_cost, safety_warning, source, page,
 *   chunk_id — and a table named `knowledge_chunks`.
 *
 *   If your actual table/column names differ, edit the SQL query below
 *   (the SELECT statement) to match. Run `\d knowledge_chunks` in psql
 *   first if you're not sure — better to check than guess wrong here.
 */

require('dotenv').config(); // loads DATABASE_URL from .env if present
const { Pool } = require('pg');
const fs = require('fs');

const OUTPUT_PATH = 'knowledge_chunks.json';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL is not set. Set it in .env or inline before running.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('render.com') || connectionString.includes('supabase')
      ? { rejectUnauthorized: false }
      : false,
  });

  try {
    const query = `
      SELECT
        chunk_id,
        device_category,
        brand,
        model,
        symptom,
        possible_cause,
        solution,
        severity,
        difficulty,
        estimated_cost,
        safety_warning,
        source,
        page,
        chunk_text
      FROM knowledge_chunks
      ORDER BY chunk_id;
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      console.warn('WARNING: query returned 0 rows. Table name or connection may be wrong — double-check before continuing.');
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result.rows, null, 2), 'utf-8');
    console.log(`Exported ${result.rows.length} rows to ${OUTPUT_PATH}`);

    if (result.rows.length > 0) {
      console.log('\nFirst row (sanity check):');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
  } catch (err) {
    console.error('Export failed:', err.message);
    if (err.message.includes('does not exist')) {
      console.error('\nLikely cause: table or column name mismatch. Run `\\d knowledge_chunks` in psql to check actual names, then edit the SELECT statement in this script.');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();