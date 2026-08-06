// backend/src/ai/vector-store/vector-store.interface.ts

import {
  EmbeddedChunk,
  ScoredChunk,
  VectorSearchFilters,
} from './vector-store.types';

/**
 * The swappable boundary described in the Phase 5 plan (§1, §7).
 *
 * Nothing outside the vector-store folder should ever import
 * InMemoryVectorStore (or, later, PgVectorStore) directly — every
 * consumer (ingestion, retrieval) depends on this interface via
 * Nest's dependency injection, using the VECTOR_STORE token below.
 *
 * When Phase 4.3 unblocks, PgVectorStore implements this same
 * interface and gets bound to the same token in ai.module.ts.
 * No consumer code changes.
 */
export interface VectorStore {
  /**
   * Persist one embedded chunk.
   */
  addChunk(chunk: EmbeddedChunk): Promise<void>;

  /**
   * Persist many embedded chunks at once (used by the ingestion
   * pipeline after a batch embedding call — see Phase 5.5/5.6).
   * Implementations should override this for bulk-insert efficiency
   * where possible; the default in-memory version can just loop.
   */
  addChunks(chunks: EmbeddedChunk[]): Promise<void>;

  /**
   * Return the top-K chunks most similar to queryEmbedding,
   * restricted to chunks matching `filters`.
   *
   * Implementations filter by metadata BEFORE scoring similarity —
   * cheap filter first, expensive math second (Phase 5 plan, §7).
   */
  search(
    queryEmbedding: number[],
    filters: VectorSearchFilters,
    topK: number,
  ): Promise<ScoredChunk[]>;

  /**
   * Total number of chunks currently stored. Useful for health
   * checks, admin dashboards ("Knowledge base coverage" per the
   * Overview's Dashboard requirements), and tests.
   */
  count(): Promise<number>;
}

/**
 * Injection token. NestJS interfaces don't exist at runtime, so we
 * bind implementations to this token string rather than the type.
 *
 * Usage in a consumer:
 *   constructor(@Inject(VECTOR_STORE) private store: VectorStore) {}
 *
 * Usage in ai.module.ts:
 *   { provide: VECTOR_STORE, useClass: InMemoryVectorStore }
 *   // later: useClass: PgVectorStore
 */
export const VECTOR_STORE = Symbol('VECTOR_STORE');