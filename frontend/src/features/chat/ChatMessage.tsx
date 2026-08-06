import { cn } from "@/utils/cn";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-md rounded-lg px-4 py-2 text-sm",
          isUser
            ? "bg-orange-500 text-slate-950"
            : "bg-slate-800 text-slate-100",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}