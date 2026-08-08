import { Body, Controller, Post, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { RetrievalService } from './retrieval/retrieval.service';
import { GenerationService } from './generation/generation.service';
import { PG_POOL } from '../database/database.constants';

interface TroubleshootRequestDto {
  symptom: string;
  deviceCategory?: string;
  brand?: string;
  model?: string;
}

@Controller('troubleshoot')
export class TroubleshootController {
  constructor(
    private readonly retrievalService: RetrievalService,
    private readonly generationService: GenerationService,
    @Inject(PG_POOL) private readonly pool: Pool,
  ) {}

  @Post()
  async troubleshoot(@Body() body: TroubleshootRequestDto) {
    const { chunks, sufficientEvidence } = await this.retrievalService.retrieve(
      body.symptom,
      {
        deviceCategory: body.deviceCategory,
        brand: body.brand,
        model: body.model,
      },
    );

    const result = await this.generationService.generate(
      body.symptom,
      chunks,
      sufficientEvidence,
    );

    const saved = await this.pool.query(
      `INSERT INTO troubleshoot_sessions
        (device_category, brand, model, symptom, status, confidence_score,
         possible_causes, solution_steps, safety_warnings, "references",
         insufficient_evidence)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, created_at`,
      [
        body.deviceCategory ?? null,
        body.brand ?? null,
        body.model ?? null,
        body.symptom,
        'open',
        result.confidence,
        JSON.stringify(result.possibleCauses),
        JSON.stringify(result.solutionSteps),
        JSON.stringify(result.safetyWarnings),
        JSON.stringify(result.references),
        result.insufficientEvidence,
      ],
    );

    return { ...result, sessionId: saved.rows[0].id, createdAt: saved.rows[0].created_at };
  }

  @Get()
  async listSessions() {
    const result = await this.pool.query(
      `SELECT id, device_category, brand, model, symptom, status,
              confidence_score, insufficient_evidence, created_at
       FROM troubleshoot_sessions
       ORDER BY created_at DESC
       LIMIT 50`,
    );
    return result.rows;
  }
}