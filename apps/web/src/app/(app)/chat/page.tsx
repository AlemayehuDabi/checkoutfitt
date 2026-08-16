import type { Metadata } from "next";
import { mockChatMessages } from "@/lib/mock-data";
import { ChatView } from "@/components/chat/chat-view";

export const metadata: Metadata = {
  title: "AI Stylist",
  description: "Ask your stylist what to wear and get outfits from your own closet.",
};

export default function ChatPage() {
  return <ChatView initialMessages={mockChatMessages} />;
}
