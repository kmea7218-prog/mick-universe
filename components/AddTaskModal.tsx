"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import type { Project, Priority } from "@/types";

interface Props {
  projects: Project[];
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  defaultProjectId?: string;
}

export default function AddTaskModal({
  projects,
  open,
  onClose,
  onCreated,
  defaultProjectId,
}: Props) {
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notion/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          projectId: projectId || undefined,
          priority,
          summary: summary.trim(),
        }),
      });
      if (!res.ok) throw new Error("建立失敗");
      onCreated();
      // Reset
      setName("");
      setSummary("");
      setPriority("Medium");
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-mick-lg w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-mick-violet/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-mick-gradient flex items-center justify-center text-white">
              <Plus size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-lg">新增任務</div>
              <div className="text-xs text-ink-mute">將直接同步到 Notion</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-canvas-soft text-ink-mute flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono tracking-wider text-ink-mute uppercase mb-1.5 block">
              任務名稱 *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：設計 FARMIQ 月度報告樣板"
              className="w-full px-4 py-3 bg-canvas-soft rounded-xl outline-none focus:ring-2 ring-mick-violet/30 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono tracking-wider text-ink-mute uppercase mb-1.5 block">
                所屬主軸
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-3 bg-canvas-soft rounded-xl outline-none focus:ring-2 ring-mick-violet/30 text-sm"
              >
                <option value="">（無）</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono tracking-wider text-ink-mute uppercase mb-1.5 block">
                優先度
              </label>
              <div className="flex gap-1.5">
                {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-3 rounded-xl text-xs font-semibold transition ${
                      priority === p
                        ? "bg-mick-gradient text-white shadow-mick-sm"
                        : "bg-canvas-soft text-ink-soft hover:bg-mick-violet/10"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono tracking-wider text-ink-mute uppercase mb-1.5 block">
              簡述（選填）
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="補充細節..."
              rows={3}
              className="w-full px-4 py-3 bg-canvas-soft rounded-xl outline-none focus:ring-2 ring-mick-violet/30 text-sm resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-canvas-soft/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft hover:bg-canvas-cool"
          >
            取消
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-mick-gradient text-white shadow-mick-sm disabled:opacity-40 flex items-center gap-2 hover:scale-[1.02] transition"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            建立並同步到 Notion
          </button>
        </div>
      </div>
    </div>
  );
}
