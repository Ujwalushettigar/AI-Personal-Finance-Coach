"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { askCoach } from "../../services/api/coach";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

export default function CoachPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: "coach",
      text: "Ask me about your spending, budget, or subscriptions. I’ll keep the answer brief and actionable.",
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
      <div className="min-h-screen bg-[#070b16] p-6 flex items-center justify-center text-slate-100">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="text-sm font-semibold text-slate-400">Loading AI Coach...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#070b16] text-slate-100 flex flex-col p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col bg-slate-950/70 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                FinPilot AI Coach
                <span className="text-[10px] font-extrabold uppercase bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full">
                  Gemini 2.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">
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
                    ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                    : "bg-accent/20 border border-accent/40 text-accent"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-accent text-ink font-medium rounded-tr-none"
                    : "bg-slate-900/80 border border-white/10 text-slate-100 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900/80 border border-white/10 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Coach is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask your AI coach a financial question..."
                        maxLength={1000}
            className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-accent hover:bg-accent-dark text-ink font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
