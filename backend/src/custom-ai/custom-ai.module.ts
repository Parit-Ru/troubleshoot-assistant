import { Module } from '@nestjs/common';
import { CustomAiController } from './custom-ai.controller';
import { CustomAiGenerationService } from './custom-ai.generation.service';
import { RetrievalModule } from '../ai/retrieval/retrieval.module';

// Importing RetrievalModule (rather than re-declaring RetrievalService and
// EmbeddingService as providers here) reuses the exact same wiring your
// existing TroubleshootModule uses — one shared RetrievalService instance,
// not a duplicate. This assumes RetrievalModule exports RetrievalService;
// if this errors on RetrievalService not being available for injection,
// open retrieval.module.ts and confirm it has RetrievalService in its
// `exports` array (not just `providers`) — paste it back if so and I'll
// adjust.

@Module({
  imports: [RetrievalModule],
  controllers: [CustomAiController],
  providers: [CustomAiGenerationService],
})
export class CustomAiModule {}