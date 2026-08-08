import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ChatMessage,
  type ChatMessageData,
} from "@/features/chat/ChatMessage";
import { chatService } from "@/services/chat.service";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const trimmed = input.trim();
    if (trimmed === "" || isSending) return;

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const response = await chatService.sendMessage(trimmed);
      const aiMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Real network/CORS/backend-down errors land here — surfaced to
      // the user rather than silently failing.
      setError("Couldn't reach the AI. Is the backend server running?");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border border-slate-800 bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Say hello to start chatting.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        {isSending && (
          <p className="mt-2 text-xs text-slate-500">AI is typing...</p>
        )}
      </div>

      {error && <p className="px-4 pb-2 text-xs text-red-400">{error}</p>}

      <div className="flex gap-2 border-t border-slate-800 p-3">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <Button variant="primary" onClick={handleSend} disabled={isSending}>
          Send
        </Button>
      </div>
    </div>
  );
}