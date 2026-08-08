import { Module } from '@nestjs/common';
import { RetrievalService } from './retrieval.service';
import { EmbeddingModule } from '../embedding/embedding.module';

@Module({
  imports: [EmbeddingModule],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}