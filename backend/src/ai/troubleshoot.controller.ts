import { Body, Controller, Post, Get, Delete, Param, Inject, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Pool } from 'pg';
import { RetrievalService } from './retrieval/retrieval.service';
import { GenerationService } from './generation/generation.service';
import { PG_POOL } from '../database/database.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

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
  @UseGuards(OptionalJwtAuthGuard)
  async troubleshoot(@Body() body: TroubleshootRequestDto, @Req() req: Request) {
    const userId = (req.user as { id: string } | undefined)?.id ?? null;

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
        (user_id, device_category, brand, model, symptom, status, confidence_score,
         possible_causes, solution_steps, safety_warnings, "references",
         insufficient_evidence)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, created_at`,
      [
        userId,
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
  @UseGuards(JwtAuthGuard)
  async listSessions(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    const result = await this.pool.query(
      `SELECT id, device_category, brand, model, symptom, status,
              confidence_score, insufficient_evidence, created_at, "references"
       FROM troubleshoot_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId],
    );
    return result.rows;
  }
    @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSession(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;

    const result = await this.pool.query(
      `DELETE FROM troubleshoot_sessions WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException('Session not found or not owned by you');
    }

    return { success: true, id };
  }
}