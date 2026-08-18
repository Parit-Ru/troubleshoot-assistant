import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RetrievedChunk } from '../ai/retrieval/retrieval.service';

export interface CustomAiResult {
  available: boolean;
  rawAnswer: string | null;
  references: { source: string; page: number }[];
  insufficientEvidence: boolean;
  errorMessage: string | null;
}

@Injectable()
export class CustomAiGenerationService {
  private readonly logger = new Logger(CustomAiGenerationService.name);

  constructor(private readonly config: ConfigService) {}

  async generate(
    symptom: string,
    chunks: RetrievedChunk[],
    sufficientEvidence: boolean,
  ): Promise<CustomAiResult> {
    if (!sufficientEvidence || chunks.length === 0) {
      return {
        available: true,
        rawAnswer: null,
        references: [],
        insufficientEvidence: true,
        errorMessage: null,
      };
    }

    const modelUrl = this.config.get<string>('FINE_TUNED_MODEL_URL');
    if (!modelUrl) {
      return {
        available: false,
        rawAnswer: null,
        references: [],
        insufficientEvidence: false,
        errorMessage: 'Custom model URL is not configured on the server.',
      };
    }

    // Use the top 2-3 chunks as context, not just the single best match.
    // Evaluation found that top-1-only retrieval was fragile — when the
    // single best match wasn't quite right (e.g. "overflow" vs "leaks"),
    // the model had nothing to fall back on. Including more candidates
    // gives it a better chance of grounding on the actually-correct one,
    // the same way the Groq baseline (which uses top-5) does.
    const usedChunks = chunks.slice(0, Math.min(3, chunks.length));
    const context = usedChunks
      .map((c) => `[Retrieved chunk — ${c.source}, Page ${c.page}]\n${c.content}`)
      .join('\n\n');

    try {
      const response = await fetch(`${modelUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ instruction: symptom, input: context }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`Model server returned ${response.status}`);
      }

      const data = (await response.json()) as { output: string };
      const sanitized = this.sanitizeReferences(data.output, usedChunks);

      return {
        available: true,
        rawAnswer: sanitized,
        references: usedChunks.map((c) => ({ source: c.source, page: c.page })),
        insufficientEvidence: false,
        errorMessage: null,
      };
    } catch (err) {
      this.logger.warn(`Custom model unreachable: ${(err as Error).message}`);
      return {
        available: false,
        rawAnswer: null,
        references: [],
        insufficientEvidence: false,
        errorMessage:
          'The custom-trained model is currently offline. It only runs when the Kaggle notebook is actively started.',
      };
    }
  }

  // Never trust the model's self-generated "## References" section — rebuild
  // it deterministically from the chunks we actually retrieved, since the
  // model has shown it can hallucinate citations (e.g. fabricated URLs) on
  // underrepresented training examples.
  private sanitizeReferences(modelOutput: string, chunks: RetrievedChunk[]): string {
    const referencesIndex = modelOutput.indexOf('## References');
    const trustedPortion =
      referencesIndex >= 0 ? modelOutput.slice(0, referencesIndex).trim() : modelOutput.trim();

    const referenceLines = chunks.map((c) => `${c.source} — Page ${c.page}`).join('\n');
    const trueReferences = `## References\n${referenceLines}`;
    return `${trustedPortion}\n\n${trueReferences}`;
  }
}