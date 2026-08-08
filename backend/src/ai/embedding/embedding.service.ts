import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

const EMBED_MODEL = 'gemini-embedding-001';
const OUTPUT_DIM = 768;

@Injectable()
export class EmbeddingService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly config: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.config.get<string>('GEMINI_API_KEY'),
    });
  }

  // 768-dim embeddings are NOT pre-normalized by the API (only 3072-dim is).
  // Must normalize manually or cosine similarity math will be wrong.
  private normalize(vec: number[]): number[] {
    const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    if (magnitude === 0) return vec;
    return vec.map((v) => v / magnitude);
  }

  // Used when ingesting knowledge chunks (documents).
  async embedDocument(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: EMBED_MODEL,
      contents: text,
      config: {
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: OUTPUT_DIM,
      },
    });
    const values = response.embeddings?.[0]?.values;
    if (!values) throw new Error('No embedding returned from Gemini');
    return this.normalize(values);
  }

  // Used when embedding a user's search/symptom query at chat time.
  async embedQuery(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: EMBED_MODEL,
      contents: text,
      config: {
        taskType: 'RETRIEVAL_QUERY',
        outputDimensionality: OUTPUT_DIM,
      },
    });
    const values = response.embeddings?.[0]?.values;
    if (!values) throw new Error('No embedding returned from Gemini');
    return this.normalize(values);
  }
}