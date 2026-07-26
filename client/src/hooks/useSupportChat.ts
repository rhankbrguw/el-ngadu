import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { APP_MESSAGES } from "@/lib/constants/messages";

export interface ChatMessageItem {
  id: string;
  role: "user" | "ai";
  content: string;
}

export function useSupportChat(isOpen: boolean) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "1",
      role: "ai",
      content: APP_MESSAGES.SUPPORT.DEFAULT_GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const newUserMsg: ChatMessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.post("/support/chat", { message: userMessage });
      const reply = response.data.data?.reply || response.data.reply;

      const aiMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: APP_MESSAGES.SUPPORT.ERROR,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    handleSend,
  };
}
