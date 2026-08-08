import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

interface SendMessageDto {
  message: string;
}

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() body: SendMessageDto) {
    const reply = await this.chatService.sendMessage(body.message);
    return { reply };
  }
}