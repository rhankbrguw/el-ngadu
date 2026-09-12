import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { PAGE_TITLES } from "@/lib/constants/titles";

export interface ChatMessageItem {
  id: string;
  role: "user" | "ai";
  content: string;
}

function useChatDocumentTitle(isOpen: boolean) {
  const previousTitleRef = useRef<string>("");
  useEffect(() => {
    if (isOpen) {
      previousTitleRef.current = document.title;
      document.title = PAGE_TITLES.AI_SUPPORT;
    } else if (previousTitleRef.current) {
      document.title = previousTitleRef.current;
    }
    return () => { if (previousTitleRef.current) document.title = previousTitleRef.current; };
  }, [isOpen]);
}

function useChatAutoScroll(ref: React.RefObject<HTMLDivElement | null>, isOpen: boolean, messages: ChatMessageItem[], isLoading: boolean) {
  useEffect(() => {
    if (ref.current && isOpen) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
    }
  }, [ref, isOpen, messages, isLoading]);
}

async function requestSupportReply(userMessage: string): Promise<string> {
  const response = await api.post("/support/chat", { message: userMessage });
  return response.data.data?.reply || response.data.reply;
}

export function useSupportChat(isOpen: boolean) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([{ id: "1", role: "ai", content: APP_MESSAGES.SUPPORT.DEFAULT_GREETING }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useChatDocumentTitle(isOpen);
  useChatAutoScroll(scrollRef, isOpen, messages, isLoading);


  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: userMsg }]);
    setIsLoading(true);
    try {
      const reply = await requestSupportReply(userMsg);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: APP_MESSAGES.SUPPORT.ERROR }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, scrollRef, handleSend };
}

