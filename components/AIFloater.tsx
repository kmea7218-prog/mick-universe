"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";

export default function AIFloater() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/claude/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply, timestamp: Date.now() },
      ]);
    } catch (e: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `連線錯誤：${e.message}。請確認 ANTHROPIC_API_KEY 已設定。`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 rounded-full bg-mick-gradient shadow-mick-glow
          flex items-center justify-center text-white
          hover:scale-110 transition-transform
          ${open ? "rotate-45" : ""}
        `}
        aria-label="AI 協作"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[420px] h-[580px] bg-white rounded-3xl shadow-mick-lg border border-mick-violet/10 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="px-5 py-4 border-b border-mick-violet/10 bg-gradient-to-br from-canvas-soft to-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-mick-gradient flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="font-display font-bold text-base">米克 AI</div>
                <div className="text-xs text-ink-mute">讀取你的 Notion 即時狀態</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <div className="text-sm text-ink-mute">你可以問米克：</div>
                <div className="space-y-2">
                  {[
                    "FARMIQ 目前卡在哪？",
                    "本週最該推進的三件事？",
                    "04 品牌內容暫緩會不會影響 03？",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="block w-full text-left text-[13px] px-3 py-2 rounded-xl bg-mick-violet/5 hover:bg-mick-violet/10 text-ink-soft hover:text-mick-violet transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${
                      m.role === "user"
                        ? "bg-mick-gradient text-white"
                        : "bg-canvas-soft text-ink"
                    }
                  `}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-canvas-soft flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-mick-violet" />
                  <span className="text-sm text-ink-mute">米克正在思考…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-mick-violet/10 bg-white">
            <div className="flex gap-2 items-end bg-canvas-soft rounded-2xl p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="問米克什麼都可以…"
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-sm max-h-24"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-mick-gradient text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
