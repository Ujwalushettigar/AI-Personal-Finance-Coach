"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { askCoach } from "../../services/api/coach";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";

export default function CoachPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: "coach",
      text: "Hello! I am your AI Financial Coach. Ask me anything about your budget, transactions, spending patterns, or subscription leaks!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isTyping) return;

    // Append user message
    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const data = await askCoach(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "coach", text: data?.reply || "No response received." },
      ]);
    } catch (error) {
      console.error("Coach API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "I'm having trouble answering right now, please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg p-6 flex items-center justify-center text-text-primary">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="text-sm font-semibold text-text-muted">Loading AI Coach...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-bg text-text-primary flex flex-col p-4 sm:p-6 md:p-8">
      <GlassCard className="max-w-4xl w-full mx-auto flex-1 flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center font-bold">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
                FinPilot AI Coach
                <span className="text-[10px] font-extrabold uppercase bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full">
                  Gemini 2.5
                </span>
              </h1>
              <p className="text-xs text-text-muted">
                Personalized financial guidance powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Message Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.role === "user"
                    ? "bg-accent text-[#0A0E1A]"
                    : "bg-accent/10 border border-accent/30 text-accent"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4 text-[#0A0E1A]" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-accent text-[#0A0E1A] font-semibold rounded-tr-none"
                    : "bg-surface border border-border text-text-primary rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-surface border border-border text-text-muted rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Coach is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-border bg-white/5 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask your AI coach a financial question..."
            className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-accent hover:bg-accent/90 text-[#0A0E1A] font-extrabold px-5 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,136,0.3)] active:scale-95"
          >
            <span>Send</span>
            <Send className="w-4 h-4 text-[#0A0E1A]" />
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
