import { Body, Controller, Post } from '@nestjs/common';
import { RetrievalService } from './retrieval/retrieval.service';
import { GenerationService } from './generation/generation.service';

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

    return this.generationService.generate(body.symptom, chunks, sufficientEvidence);
  }
}