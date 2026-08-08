import { Module } from '@nestjs/common';
import { TroubleshootController } from './troubleshoot.controller';
import { RetrievalModule } from './retrieval/retrieval.module';
import { GenerationModule } from './generation/generation.module';

@Module({
  imports: [RetrievalModule, GenerationModule],
  controllers: [TroubleshootController],
})
export class TroubleshootModule {}