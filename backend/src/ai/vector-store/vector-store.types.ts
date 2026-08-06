// backend/src/ai/vector-store/vector-store.types.ts

/**
 * Metadata carried by every chunk through the whole query pipeline.
 * Mirrors the Knowledge Base Schema from the Project Overview —
 * this is not a new shape, it's the agreed-on one, implemented.
 */
export interface ChunkMetadata {
  chunkId: string;
  manualId: string;
  device: string; // e.g. "Washing Machine"
  brand: string; // e.g. "LG"
  model: string; // e.g. "WM3700HVA"
  category: string; // matches device category taxonomy from frontend
  source: string; // manual display name, e.g. "LG Washing Machine Manual"
  page: number;
  chunkText: string;
}

/**
 * A chunk that has been embedded and is ready to be stored.
 * `embedding` is a plain number[] on purpose — this is the exact shape
 * pgvector's `vector(n)` column expects, so the future Postgres swap
 * needs no data transformation, just a different insert call.
 */
export interface EmbeddedChunk extends ChunkMetadata {
  embedding: number[];
}

/**
 * A chunk returned from search(), with its similarity score attached.
 * `similarity` is cosine similarity in the 0–1 range (1 = identical).
 * This is the same number that becomes `confidenceScore` downstream —
 * not a separate calculation, per the Phase 5 plan's confidence design.
 */
export interface ScoredChunk extends EmbeddedChunk {
  similarity: number;
}

/**
 * Metadata filters applied before similarity search.
 * All fields optional — retrieval.service.ts (Phase 5.7) decides
 * how strict filtering should be; this store just applies whatever
 * it's given.
 */
export interface VectorSearchFilters {
  device?: string;
  brand?: string;
  model?: string;
}