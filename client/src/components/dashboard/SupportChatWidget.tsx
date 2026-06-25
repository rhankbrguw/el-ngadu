import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { Send, Bot, User, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface SupportChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportChatWidget({ isOpen, onClose }: SupportChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
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
        behavior: "smooth"
      });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.post("/support/chat", { message: userMessage });
      const reply = response.data.reply;
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: APP_MESSAGES.SUPPORT.ERROR };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] max-h-[70vh] z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-border"
        >
          <Card className="flex-1 flex flex-col h-full rounded-none border-none">
            <CardHeader className="bg-primary text-primary-foreground py-3 px-4 flex flex-row items-center justify-between rounded-none shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 p-1.5 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{APP_MESSAGES.SUPPORT.TITLE}</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-xs mt-0.5">
                    {APP_MESSAGES.SUPPORT.DESC}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-3 bg-muted/30" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === "ai" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      {msg.role === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-2xl p-3 shadow-sm text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border rounded-tl-none"}`}>
                      <div className={`whitespace-pre-wrap leading-relaxed ${msg.role === "ai" ? "text-justify" : "text-left"}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 max-w-[90%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl p-3 bg-card border border-border rounded-tl-none shadow-sm text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>{APP_MESSAGES.SUPPORT.WAITING}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-3 bg-card border-t border-border">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={APP_MESSAGES.SUPPORT.INPUT_PLACEHOLDER} className="flex-1 h-10 rounded-full px-4 bg-muted/50 border-transparent focus-visible:ring-primary text-sm" disabled={isLoading} />
                <Button type="submit" size="icon" className="h-10 w-10 rounded-full shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all" disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
