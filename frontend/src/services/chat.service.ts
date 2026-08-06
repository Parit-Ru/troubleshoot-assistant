import { apiClient } from "@/services/apiClient";

interface ChatResponse {
  reply: string;
}

export const chatService = {
  sendMessage: (message: string) =>
    apiClient.post<ChatResponse>("/chat", { message }),
};