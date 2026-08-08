import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { RetrievedChunk } from '../retrieval/retrieval.service';

export interface TroubleshootResult {
  problem: string;
  possibleCauses: string[];
  confidence: number;
  solutionSteps: string[];
  safetyWarnings: string[];
  references: { source: string; page: number }[];
  insufficientEvidence: boolean;
}

@Injectable()
export class GenerationService {
  private readonly groq: Groq;

  constructor(private readonly config: ConfigService) {
    this.groq = new Groq({ apiKey: this.config.get<string>('GROQ_API_KEY') });
  }

  async generate(
    symptom: string,
    chunks: RetrievedChunk[],
    sufficientEvidence: boolean,
  ): Promise<TroubleshootResult> {
    if (!sufficientEvidence || chunks.length === 0) {
      return {
        problem: symptom,
        possibleCauses: [],
        confidence: chunks[0]?.similarity ?? 0,
        solutionSteps: [],
        safetyWarnings: [],
        references: [],
        insufficientEvidence: true,
      };
    }

    const context = chunks
      .map(
        (c, i) =>
          `[Chunk ${i + 1}] Source: ${c.source}, Page: ${c.page}\n` +
          `Symptom: ${c.symptom}\nCause: ${c.possible_cause}\n` +
          `Solution: ${c.solution}\nSafety: ${c.safety_warning ?? 'None'}\n` +
          `Content: ${c.content}`,
      )
      .join('\n\n');

    const prompt = `You are an appliance troubleshooting assistant. Use ONLY the context below to answer. Never invent information not present in the context.

Context:
${context}

User's symptom: "${symptom}"

Respond ONLY with valid JSON matching this exact shape, no markdown, no preamble:
{
  "problem": string,
  "possibleCauses": string[],
  "solutionSteps": string[],
  "safetyWarnings": string[]
}`;

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);

    return {
      problem: parsed.problem ?? symptom,
      possibleCauses: parsed.possibleCauses ?? [],
      confidence: chunks[0].similarity,
      solutionSteps: parsed.solutionSteps ?? [],
      safetyWarnings: parsed.safetyWarnings ?? [],
      references: chunks.map((c) => ({ source: c.source, page: c.page })),
      insufficientEvidence: false,
    };
  }
}