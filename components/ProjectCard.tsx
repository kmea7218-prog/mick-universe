"use client";

import { Project } from "@/types";
import { ExternalLink, MoreVertical, Pencil, Trash2, Target } from "lucide-react";
import { useState } from "react";

interface Props {
  project: Project;
  taskCount?: number;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Project["status"]) => void;
}

const priorityColors: Record<string, string> = {
  High: "bg-gradient-to-r from-mick-violet to-mick-magenta text-white",
  Medium: "bg-mick-purple/15 text-mick-purple",
  Low: "bg-mick-blue/15 text-mick-blue",
};

const statusColors: Record<string, string> = {
  "In Progress": "bg-mick-violet/10 text-mick-violet",
  Backlog: "bg-ink-whisper/30 text-ink-soft",
  Paused: "bg-amber-100 text-amber-700",
  Done: "bg-emerald-100 text-emerald-700",
  Canceled: "bg-rose-100 text-rose-700",
};

export default function ProjectCard({
  project,
  taskCount,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const is2026Target = project.priority === "High";

  return (
    <div className="group relative bg-white rounded-2xl p-5 shadow-mick-sm hover:shadow-mick-md transition-all duration-300 border border-mick-violet/8">
      {is2026Target && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-mick-gradient flex items-center justify-center shadow-mick-sm">
          <Target size={14} className="text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md ${priorityColors[project.priority]}`}
            >
              {project.priority}
            </span>
            <span
              className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md ${statusColors[project.status]}`}
            >
              {project.status}
            </span>
          </div>
          <h3 className="font-display font-semibold text-base leading-snug text-ink">
            {project.name}
          </h3>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg hover:bg-mick-violet/10 text-ink-mute hover:text-mick-violet flex items-center justify-center transition"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-mick-md border border-mick-violet/10 py-1 z-30"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-mick-violet/5 text-ink-soft"
              >
                <ExternalLink size={13} /> 在 Notion 開啟
              </a>
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(project);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-mick-violet/5 text-ink-soft text-left"
                >
                  <Pencil size={13} /> 編輯
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm(`確定要封存「${project.name}」嗎？`)) {
                      onDelete(project.id);
                    }
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-rose-50 text-rose-600 text-left"
                >
                  <Trash2 size={13} /> 封存
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {project.summary && (
        <p className="text-sm text-ink-soft leading-relaxed mb-4 line-clamp-2">
          {project.summary}
        </p>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-mute">
            完成進度 {taskCount !== undefined && `· ${taskCount} 個任務`}
          </span>
          <span className="font-mono font-semibold text-mick-violet">{project.completion}%</span>
        </div>
        <div className="h-2 rounded-full bg-canvas-cool overflow-hidden">
          <div
            className="h-full bg-mick-gradient transition-all duration-700"
            style={{ width: `${project.completion}%` }}
          />
        </div>
      </div>
    </div>
  );
}
