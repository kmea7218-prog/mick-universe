"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, Trash2, Sparkles, Zap } from "lucide-react";
import type { ChatMessage } from "@/types";

const QUICK_PROMPTS = [
  { icon: "🎯", text: "目前米克六大主軸哪個卡住？給我具體分析。" },
  { icon: "⚡", text: "如果只能推進 3 個任務，你會選哪幾個？為什麼？" },
  { icon: "🧠", text: "幫我做一份本週回顧摘要，可以貼回 Notion 的。" },
  { icon: "🔍", text: "FARMIQ 第一版還缺什麼？列出可執行的缺口。" },
  { icon: "💡", text: "看看我進行中的任務，有沒有可以合併或刪掉的？" },
  { icon: "🎲", text: "給我一個挑戰我現在思考方式的問題。" },
];

export default function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = text ?? input;
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: content.trim(),
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
          content: `連線錯誤：${e.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    if (messages.length === 0) return;
    if (confirm("清除所有對話？")) setMessages([]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-[0.2em] text-mick-violet font-semibold uppercase">
            AI · 戰略協作
          </span>
          <h1 className="font-display text-4xl font-bold gradient-text mt-1">米克 AI 中控</h1>
          <p className="text-ink-soft mt-2 max-w-xl">
            連動你的 Notion 資料，作為你的思考夥伴。每次對話都會即時讀取當前六大主軸與任務狀態。
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
          >
            <Trash2 size={14} />
            清除對話
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="bg-white rounded-3xl border border-mick-violet/10 shadow-mick-md overflow-hidden flex flex-col h-[calc(100vh-240px)]">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-mick-gradient flex items-center justify-center text-white shadow-mick-glow animate-float mb-4">
                <Sparkles size={28} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">問米克什麼都可以</h3>
              <p className="text-sm text-ink-soft max-w-md mb-8">
                米克會讀取你的 Notion 即時狀態來回答。以下是幾個起手式：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl w-full">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => send(p.text)}
                    className="text-left p-4 rounded-xl bg-canvas-soft hover:bg-mick-violet/10 transition border border-transparent hover:border-mick-violet/20"
                  >
                    <span className="text-lg mr-2">{p.icon}</span>
                    <span className="text-sm text-ink-soft">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-9 h-9 rounded-xl bg-mick-gradient flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <Sparkles size={15} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-5 py-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-mick-gradient text-white"
                        : "bg-canvas-soft text-ink"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-mick-gradient flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <Sparkles size={15} />
                  </div>
                  <div className="px-5 py-3.5 rounded-2xl bg-canvas-soft flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-mick-violet" />
                    <span className="text-sm text-ink-mute">米克正在讀取 Notion 並思考…</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-mick-violet/10 bg-canvas-soft/30">
          <div className="flex gap-3 items-end bg-white rounded-2xl p-3 border border-mick-violet/10 shadow-mick-sm">
            <Zap size={16} className="text-mick-violet mb-2.5 ml-1 flex-shrink-0" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="問米克..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-mick-gradient text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-xs text-ink-mute mt-2 text-center">
            Enter 送出 · Shift+Enter 換行
          </div>
        </div>
      </div>
    </div>
  );
}
