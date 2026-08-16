import { Body, Controller, Post, Req, UseGuards, Logger } from '@nestjs/common';
import type { Request } from 'express';
import { RetrievalService } from '../ai/retrieval/retrieval.service';
import { CustomAiGenerationService } from './custom-ai.generation.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

interface CustomAiRequestDto {
  symptom: string;
  deviceCategory?: string;
  brand?: string;
  model?: string;
}

@Controller('custom-ai')
export class CustomAiController {
  private readonly logger = new Logger(CustomAiController.name);

  constructor(
    private readonly retrievalService: RetrievalService,
    private readonly customAiGenerationService: CustomAiGenerationService,
  ) {}

  @Post('troubleshoot')
  @UseGuards(OptionalJwtAuthGuard)
  async troubleshoot(@Body() body: CustomAiRequestDto, @Req() req: Request) {
    const { chunks, sufficientEvidence } = await this.retrievalService.retrieve(
      body.symptom,
      {
        deviceCategory: body.deviceCategory,
        brand: body.brand,
        model: body.model,
      },
    );

    // TEMPORARY diagnostic log — remove once we've confirmed the threshold issue
    this.logger.log(
      `Top similarity: ${chunks[0]?.similarity ?? 'no chunks'} | sufficientEvidence: ${sufficientEvidence}`,
    );

    const result = await this.customAiGenerationService.generate(
      body.symptom,
      chunks,
      sufficientEvidence,
    );

    return result;
  }
}