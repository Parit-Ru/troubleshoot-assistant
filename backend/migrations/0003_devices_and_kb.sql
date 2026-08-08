CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_category TEXT,
  brand TEXT,
  model TEXT,
  symptom TEXT,
  possible_cause TEXT,
  solution TEXT,
  severity TEXT,
  difficulty TEXT,
  estimated_cost TEXT,
  safety_warning TEXT,
  source TEXT,
  page INTEGER,
  chunk_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);