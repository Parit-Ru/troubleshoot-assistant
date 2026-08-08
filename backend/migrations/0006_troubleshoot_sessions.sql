-- 0006_troubleshoot_sessions.sql
CREATE TABLE IF NOT EXISTS troubleshoot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_category TEXT,
  brand TEXT,
  model TEXT,
  symptom TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  confidence_score DOUBLE PRECISION,
  possible_causes JSONB,
  solution_steps JSONB,
  safety_warnings JSONB,
  "references" JSONB,
  insufficient_evidence BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);