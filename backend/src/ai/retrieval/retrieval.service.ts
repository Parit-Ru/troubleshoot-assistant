import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/database.constants';
import { EmbeddingService } from '../embedding/embedding.service';

export const CONFIDENCE_THRESHOLD = 0.5;

export interface RetrievalFilters {
  deviceCategory?: string;
  brand?: string;
  model?: string;
}

export interface RetrievedChunk {
  chunk_id: string;
  content: string;
  symptom: string | null;
  possible_cause: string | null;
  solution: string | null;
  severity: string | null;
  safety_warning: string | null;
  source: string;
  page: number;
  similarity: number;
}

@Injectable()
export class RetrievalService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly embeddingService: EmbeddingService,
  ) { }

  async retrieve(
    query: string,
    filters: RetrievalFilters = {},
    topK = 5,
  ): Promise<{ chunks: RetrievedChunk[]; sufficientEvidence: boolean }> {
    const queryVector = await this.embeddingService.embedQuery(query);
    const vectorLiteral = `[${queryVector.join(',')}]`;

    const conditions: string[] = [];
    const params: any[] = [vectorLiteral];
    let paramIndex = 2;

    if (filters.deviceCategory) {
      conditions.push(`device_category = $${paramIndex++}`);
      params.push(filters.deviceCategory);
    }
    if (filters.brand) {
      conditions.push(`brand = $${paramIndex++}`);
      params.push(filters.brand);
    }
    if (filters.model) {
      conditions.push(`model ILIKE $${paramIndex++}`);
      params.push(`%${filters.model}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(topK);

    const sql = `
      SELECT
        chunk_id, chunk_text AS content, symptom, possible_cause, solution,
        severity, safety_warning, source, page,
        1 - (embedding <=> $1) AS similarity
      FROM knowledge_chunks
      ${whereClause}
      ORDER BY embedding <=> $1
      LIMIT $${paramIndex}
    `;

    const result = await this.pool.query(sql, params);
    const chunks: RetrievedChunk[] = result.rows;

    const sufficientEvidence =
      chunks.length > 0 && chunks[0].similarity >= CONFIDENCE_THRESHOLD;

    return { chunks, sufficientEvidence };
  }
}