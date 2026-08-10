import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';

@Controller('dashboard')
export class DashboardController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Get('summary')
  async getSummary() {
    const kb = await this.pool.query(
      `SELECT COUNT(DISTINCT source) AS manual_count, COUNT(*) AS chunk_count
       FROM knowledge_chunks`,
    );
    const confidence = await this.pool.query(
      `SELECT AVG(confidence_score) AS avg_confidence
       FROM troubleshoot_sessions
       WHERE insufficient_evidence = false`,
    );
    return {
      manual_count: kb.rows[0].manual_count,
      chunk_count: kb.rows[0].chunk_count,
      avg_confidence: confidence.rows[0].avg_confidence, // null if no sessions yet
    };
  }

  @Get('category-counts')
  async getCategoryCounts() {
    const result = await this.pool.query(
      `SELECT device_category, COUNT(*) AS count
       FROM knowledge_chunks
       GROUP BY device_category`,
    );
    return result.rows; // [{ device_category: "Refrigerator", count: "15" }, ...]
  }
}