import { ChatWindow } from "@/features/chat/ChatWindow";

export function ChatPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-100">Chat</h1>
      <ChatWindow />
    </div>
  );
}