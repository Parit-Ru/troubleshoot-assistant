import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Groq from "groq-sdk";

@Injectable()
export class ChatService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    // Reads GROQ_API_KEY via the ConfigModule set up back in Phase 4.2 —
    // same pattern every future service will use to read secrets/config.
    this.groq = new Groq({
      apiKey: this.configService.get<string>("GROQ_API_KEY"),
    });
  }

  async sendMessage(message: string): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: message }],
    });

    // Groq's response shape matches OpenAI's chat completion format —
    // the reply text lives at choices[0].message.content.
    return completion.choices[0]?.message?.content ?? "";
  }
}