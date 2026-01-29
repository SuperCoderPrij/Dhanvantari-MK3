import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const N8N_WEBHOOK_URL = "https://koreankimchi.app.n8n.cloud/webhook/40463dff-8417-49b6-9a47-6e438739b284";

export function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Gemini Assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Append user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.message) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "⚠️ Gemini service is temporarily unavailable. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] md:w-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col"
            style={{ backgroundColor: "#0b0f19", height: "600px", maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4285F4] to-[#9B72FF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Gemini Assistant</h3>
                  <p className="text-xs text-blue-300">Powered by Google Gemini</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-md",
                        msg.role === "user" 
                          ? "bg-[#1f2937] text-white rounded-2xl rounded-tr-sm" 
                          : "bg-gradient-to-br from-[#4285F4] to-[#9B72FF] text-white rounded-2xl rounded-tl-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start w-full"
                  >
                    <div className="bg-gradient-to-br from-[#4285F4] to-[#9B72FF] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-md">
                      <Loader2 className="h-4 w-4 animate-spin text-white/80" />
                      <span className="text-xs text-white/90 font-medium">Gemini is thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-[#1f2937] rounded-full p-1.5 pl-4 border border-slate-700 focus-within:border-blue-500/50 transition-colors"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "h-8 w-8 rounded-full transition-all duration-300",
                    inputValue.trim() && !isLoading
                      ? "bg-gradient-to-r from-[#4285F4] to-[#9B72FF] text-white shadow-lg shadow-blue-500/20" 
                      : "bg-slate-700 text-slate-400"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-[#4285F4] to-[#9B72FF] flex items-center justify-center shadow-[0_0_30px_rgba(66,133,244,0.4)] border border-white/10 z-50"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Sparkles className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
