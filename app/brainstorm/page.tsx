"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Sparkles, Loader2, Plus, Trash2, CheckCircle } from "lucide-react";
import type { Project, BrainstormIdea } from "@/types";

// Local storage key for ideas
const STORAGE_KEY = "mick-brainstorm-ideas";

export default function BrainstormPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    // Load projects
    fetch("/api/notion/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []));

    // Load saved ideas from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setIdeas(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Auto-save ideas
  useEffect(() => {
    if (ideas.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    }
  }, [ideas]);

  async function addIdea() {
    if (!input.trim()) return;
    const newIdea: BrainstormIdea = {
      id: crypto.randomUUID(),
      content: input.trim(),
      status: "recorded",
      createdAt: Date.now(),
    };
    setIdeas([newIdea, ...ideas]);
    setInput("");
  }

  async function analyzeIdea(id: string) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    setAnalyzing(true);
    try {
      const res = await fetch("/api/claude/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.content }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIdeas((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "analyzed",
                axis: data.analysis.axis,
                aiAnalysis: `${data.analysis.suggestion}\n\n👉 下一步：${data.analysis.nextStep}`,
              }
            : i
        )
      );
    } catch (e: any) {
      alert(`分析失敗：${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  }

  async function convertToTask(id: string) {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    // Try to match the axis to a project
    let projectId: string | undefined;
    if (idea.axis) {
      const axisCode = idea.axis.match(/^(\d{2})/)?.[1];
      if (axisCode) {
        const proj = projects.find((p) => p.axis === axisCode);
        if (proj) projectId = proj.id;
      }
    }

    try {
      await fetch("/api/notion/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: idea.content.slice(0, 60),
          projectId,
          priority: "Medium",
          summary: idea.aiAnalysis ?? "",
        }),
      });
      setIdeas((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "converted" } : i))
      );
    } catch (e: any) {
      alert(`轉任務失敗：${e.message}`);
    }
  }

  function deleteIdea(id: string) {
    if (!confirm("刪除這個想法？")) return;
    const next = ideas.filter((i) => i.id !== id);
    setIdeas(next);
    if (next.length === 0) localStorage.removeItem(STORAGE_KEY);
  }

  const statusStyles: Record<string, string> = {
    recorded: "bg-canvas-cool text-ink-soft",
    analyzed: "bg-mick-violet/15 text-mick-violet",
    paused: "bg-amber-100 text-amber-700",
    converted: "bg-emerald-100 text-emerald-700",
  };

  const statusLabels: Record<string, string> = {
    recorded: "💡 記錄中",
    analyzed: "🚀 已分析",
    paused: "⏸ 暫緩",
    converted: "✅ 已轉任務",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono tracking-[0.2em] text-mick-violet font-semibold uppercase">
          Brainstorm · 腦力激盪
        </span>
        <h1 className="font-display text-4xl font-bold gradient-text mt-1">想法記錄</h1>
        <p className="text-ink-soft mt-2 max-w-xl">
          想到什麼就寫下來，不用急著判斷好壞。寫完後可請米克 AI 分析，有潛力的一鍵轉成任務。
        </p>
      </div>

      {/* Input */}
      <div className="bg-white rounded-3xl p-5 border border-mick-violet/10 shadow-mick-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-mick-gradient flex items-center justify-center text-white">
            <Lightbulb size={16} />
          </div>
          <span className="text-sm font-semibold text-ink">新想法</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addIdea();
          }}
          placeholder="例如：FARMIQ 月報可以加一個『前三名 / 後三名』比較區塊，讓牧場知道自己在群體中的位置..."
          rows={3}
          className="w-full px-4 py-3 bg-canvas-soft rounded-xl outline-none focus:ring-2 ring-mick-violet/30 text-sm resize-none"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-ink-mute">Cmd/Ctrl + Enter 快速送出</span>
          <button
            onClick={addIdea}
            disabled={!input.trim()}
            className="px-5 py-2 rounded-xl bg-mick-gradient text-white text-sm font-semibold shadow-mick-sm disabled:opacity-40 flex items-center gap-2 hover:scale-[1.02] transition"
          >
            <Plus size={14} />
            記錄想法
          </button>
        </div>
      </div>

      {/* Ideas list */}
      <div className="space-y-3">
        {ideas.length === 0 ? (
          <div className="text-center py-16 text-ink-mute">
            <Lightbulb size={40} className="mx-auto mb-3 opacity-30" />
            <div>還沒有想法，上面輸入第一個吧</div>
          </div>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-2xl p-5 border border-mick-violet/8 shadow-mick-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md ${statusStyles[idea.status]}`}
                    >
                      {statusLabels[idea.status]}
                    </span>
                    {idea.axis && (
                      <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-mick-purple/10 text-mick-purple">
                        {idea.axis}
                      </span>
                    )}
                    <span className="text-[10px] text-ink-mute">
                      {new Date(idea.createdAt).toLocaleDateString("zh-TW")}
                    </span>
                  </div>
                  <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                    {idea.content}
                  </p>
                </div>
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="w-7 h-7 rounded-lg hover:bg-rose-50 text-ink-mute hover:text-rose-600 flex items-center justify-center"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* AI Analysis result */}
              {idea.aiAnalysis && (
                <div className="mt-3 p-4 rounded-xl bg-mick-gradient-soft border border-mick-violet/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-mick-violet" />
                    <span className="text-[11px] font-mono tracking-wider text-mick-violet font-semibold">
                      米克 AI 分析
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
                    {idea.aiAnalysis}
                  </p>
                </div>
              )}

              {/* Actions */}
              {idea.status !== "converted" && (
                <div className="flex gap-2 mt-3">
                  {idea.status === "recorded" && (
                    <button
                      onClick={() => analyzeIdea(idea.id)}
                      disabled={analyzing}
                      className="px-4 py-2 rounded-lg bg-mick-violet/10 text-mick-violet text-xs font-semibold hover:bg-mick-violet/20 flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {analyzing ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      請米克 AI 分析
                    </button>
                  )}
                  {idea.status === "analyzed" && (
                    <button
                      onClick={() => convertToTask(idea.id)}
                      className="px-4 py-2 rounded-lg bg-mick-gradient text-white text-xs font-semibold flex items-center gap-1.5 shadow-mick-sm"
                    >
                      <CheckCircle size={12} />
                      轉成正式任務
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
