import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Get('manuals')
  async getManuals(@Query('search') search?: string) {
    const params: any[] = [];
    let where = '';
    if (search) {
      where = `WHERE brand ILIKE $1 OR model ILIKE $1 OR device_category ILIKE $1`;
      params.push(`%${search}%`);
    }

    const result = await this.pool.query(
      `SELECT
         source AS id,
         brand,
         model,
         device_category,
         COUNT(DISTINCT page) AS pages,
         COUNT(*) AS chunks,
         'indexed' AS status,
         MIN(created_at) AS uploaded_at
       FROM knowledge_chunks
       ${where}
       GROUP BY source, brand, model, device_category
       ORDER BY MIN(created_at) DESC`,
      params,
    );
    return result.rows;
  }

  @Get('records')
  async getRecords(@Query('search') search?: string) {
    const params: any[] = [];
    let where = '';
    if (search) {
      where = `WHERE symptom ILIKE $1 OR possible_cause ILIKE $1 OR device_category ILIKE $1`;
      params.push(`%${search}%`);
    }

    const result = await this.pool.query(
      `SELECT
         chunk_id AS id,
         device_category,
         brand,
         symptom,
         possible_cause,
         severity,
         difficulty
       FROM knowledge_chunks
       ${where}
       ORDER BY created_at DESC
       LIMIT 100`,
      params,
    );
    return result.rows;
  }

  @Get('stats')
  async getStats() {
    const result = await this.pool.query(
      `SELECT
         COUNT(DISTINCT source) AS manual_count,
         COUNT(*) AS chunk_count
       FROM knowledge_chunks`,
    );
    return result.rows[0];
  }
}