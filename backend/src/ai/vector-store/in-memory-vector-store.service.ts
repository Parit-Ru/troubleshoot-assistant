// backend/src/ai/vector-store/in-memory-vector-store.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { VectorStore } from './vector-store.interface';
import {
  EmbeddedChunk,
  ScoredChunk,
  VectorSearchFilters,
} from './vector-store.types';

/**
 * Development/testing implementation of VectorStore.
 *
 * Holds embedded chunks in a plain array, reset on server restart.
 * Acceptable for now precisely because Phase 4.3 exists to replace
 * this with PgVectorStore for production — this class is not meant
 * to be hardened, only correct and easy to reason about.
 */
@Injectable()
export class InMemoryVectorStore implements VectorStore {
  private readonly logger = new Logger(InMemoryVectorStore.name);
  private chunks: EmbeddedChunk[] = [];

  async addChunk(chunk: EmbeddedChunk): Promise<void> {
    this.validateEmbedding(chunk);
    this.chunks.push(chunk);
  }

  async addChunks(chunks: EmbeddedChunk[]): Promise<void> {
    chunks.forEach((chunk) => this.validateEmbedding(chunk));
    this.chunks.push(...chunks);
    this.logger.log(
      `Stored ${chunks.length} chunks (total now: ${this.chunks.length})`,
    );
  }

  async search(
    queryEmbedding: number[],
    filters: VectorSearchFilters,
    topK: number,
  ): Promise<ScoredChunk[]> {
    // Cheap filter first, expensive similarity math second — per the
    // Phase 5 plan (§7): filtering out irrelevant chunks before
    // scoring avoids wasted cosine computations.
    const candidates = this.chunks.filter((chunk) =>
      this.matchesFilters(chunk, filters),
    );

    const scored: ScoredChunk[] = candidates.map((chunk) => ({
      ...chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    scored.sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, topK);
  }

  async count(): Promise<number> {
    return this.chunks.length;
  }

  // ---- internal helpers -------------------------------------------------

  private matchesFilters(
    chunk: EmbeddedChunk,
    filters: VectorSearchFilters,
  ): boolean {
    if (filters.device && chunk.device !== filters.device) return false;
    if (filters.brand && chunk.brand !== filters.brand) return false;
    if (filters.model && chunk.model !== filters.model) return false;
    return true;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error(
        `Embedding dimension mismatch: query has ${a.length}, chunk has ${b.length}. ` +
          `This usually means the embedding model changed mid-dataset.`,
      );
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0; // avoid division by zero for a zero-vector edge case
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  private validateEmbedding(chunk: EmbeddedChunk): void {
    if (!Array.isArray(chunk.embedding) || chunk.embedding.length === 0) {
      throw new Error(
        `Chunk ${chunk.chunkId} has no embedding — did the embedding step run before storage?`,
      );
    }
  }
}