-- 0005_chunk_id.sql
ALTER TABLE knowledge_chunks
  ADD COLUMN IF NOT EXISTS chunk_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS chunk_text TEXT;