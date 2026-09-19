"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { askCoach } from "../../services/api/coach";
import { Send, Bot, User, Sparkles, Loader2, Zap } from "lucide-react";

/**
 * CoachPage (CryptoVault Fintech Theme)
 * - Deep navy background #0A0E27
 * - Main chat card container in #0F1633 with border-white/10
 * - Header with #39FF14 neon green AI badge
 * - User messages in signature #0A84FF blue bubbles
 * - Coach messages in #0B1029 surface bubbles with #39FF14 avatar icon tiles
 * - Quick prompt suggestion pills for enhanced user interaction
 * - Signature #39FF14 neon green Send button with glow effect
 * - Preserved 100% of chat logic, state, auth checks, and askCoach API calls
 */
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

  const SUGGESTED_PROMPTS = [
    "How can I reduce my monthly expenses?",
    "Analyze my subscription leaks",
    "How much should I save for emergencies?",
    "Give me budget optimization tips",
  ];

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

  const handleSend = async (e, promptText) => {
    if (e) e.preventDefault();
    const textToSend = promptText || inputMessage;
    const trimmed = textToSend.trim();
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
      <div className="min-h-screen bg-[#0A0E27] p-6 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#39FF14]" />
          <span className="text-sm font-semibold text-[#8A93B5]">
            Loading AI Coach...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#0A0E27] text-white flex flex-col p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col bg-[#0F1633] border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0B1029] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#161F48] border border-[#39FF14]/30 text-[#39FF14] flex items-center justify-center font-bold shadow-[0_0_16px_rgba(57,255,20,0.15)]">
              <Bot className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                FinPilot AI Coach
                <span className="text-[10px] font-extrabold uppercase bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30 px-2.5 py-0.5 rounded-full tracking-wider">
                  Gemini 2.0
                </span>
              </h1>
              <p className="text-xs text-[#8A93B5]">
                Personalized financial guidance powered by AI
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-3 py-1.5 rounded-xl font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>Active Telemetry</span>
          </div>
        </div>

        {/* Message Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.role === "user"
                  ? "bg-[#0A84FF] text-white shadow-[0_0_12px_rgba(10,132,255,0.4)]"
                  : "bg-[#161F48] border border-[#39FF14]/30 text-[#39FF14]"
                  }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4 text-[#0A0E1A]" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-[#0A84FF] text-white font-medium rounded-tr-none shadow-[0_0_16px_rgba(10,132,255,0.25)]"
                  : "bg-[#0B1029] border border-white/10 text-white rounded-tl-none shadow-sm"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#161F48] border border-[#39FF14]/30 text-[#39FF14] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#0B1029] border border-white/10 text-[#8A93B5] rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#39FF14]" />
                <span>Coach is analyzing financial models...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions (if few messages) */}
        {messages.length <= 2 && !isTyping && (
          <div className="px-4 sm:px-6 pb-2">
            <div className="text-xs font-semibold text-[#8A93B5] mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#39FF14]" /> Quick Prompt Suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(null, prompt)}
                  className="text-xs text-[#8A93B5] hover:text-white bg-[#0B1029] hover:bg-[#161F48] border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#0B1029] flex items-center gap-3">
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
            className="bg-[#39FF14] hover:bg-[#32e012] text-[#0A0E27] font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_18px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Send</span>
            <Send className="w-4 h-4 text-[#0A0E1A]" />
          </button>
        </form>
      </div>
    </div>
  );
}
