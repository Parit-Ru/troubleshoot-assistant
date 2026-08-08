import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI } from '@google/genai';

const EMBED_MODEL = 'gemini-embedding-001';
const OUTPUT_DIM = 768;

function normalize(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return magnitude === 0 ? vec : vec.map((v) => v / magnitude);
}

interface KnowledgeChunk {
  chunk_id: string;
  device_category: string;
  brand: string;
  model: string;
  source: string;
  page: number;
  content: string;
  metadata: {
    symptom?: string;
    possible_cause?: string;
    solution?: string;
    severity?: string;
    safety_warning?: string | null;
    difficulty?: string;
  };
}

async function embed(ai: GoogleGenAI, text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
    config: { taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: OUTPUT_DIM },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values) throw new Error('No embedding returned');
  return normalize(values);
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const dir = path.join(__dirname, '..', '..', 'data', 'knowledge-chunks');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    console.log(`\nProcessing ${file}...`);
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const chunks: KnowledgeChunk[] = JSON.parse(raw);

    for (const chunk of chunks) {
      const existing = await pool.query(
        'SELECT 1 FROM knowledge_chunks WHERE chunk_id = $1',
        [chunk.chunk_id],
      );
      if ((existing.rowCount ?? 0) > 0) {
        skipped++;
        continue;
      }

      const vector = await embed(ai, chunk.content);
      const vectorLiteral = `[${vector.join(',')}]`;

      await pool.query(
        `INSERT INTO knowledge_chunks
          (chunk_id, device_category, brand, model, symptom, possible_cause,
           solution, severity, difficulty, safety_warning, source, page,
           chunk_text, embedding)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          chunk.chunk_id,
          chunk.device_category,
          chunk.brand,
          chunk.model,
          chunk.metadata?.symptom ?? null,
          chunk.metadata?.possible_cause ?? null,
          chunk.metadata?.solution ?? null,
          chunk.metadata?.severity ?? null,
          chunk.metadata?.difficulty ?? null,
          chunk.metadata?.safety_warning ?? null,
          chunk.source,
          chunk.page,
          chunk.content,
          vectorLiteral,
        ],
      );
      inserted++;
      console.log(`  ✔ ${chunk.chunk_id}`);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped (already existed): ${skipped}`);
  await pool.end();
}

main().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});