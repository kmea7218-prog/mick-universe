"use client";

import { Task, TaskStatus } from "@/types";
import { Check, Circle, Loader, Archive, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  task: Task;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
}

const priorityDotColors: Record<string, string> = {
  High: "bg-mick-magenta",
  Medium: "bg-mick-purple",
  Low: "bg-mick-blue",
};

const statusConfig: Record<TaskStatus, { icon: any; color: string; bg: string }> = {
  "Not Started": { icon: Circle, color: "text-ink-mute", bg: "bg-canvas-cool" },
  "In Progress": { icon: Loader, color: "text-mick-violet", bg: "bg-mick-violet/10" },
  Done: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-100" },
  Archived: { icon: Archive, color: "text-ink-mute", bg: "bg-canvas-cool" },
};

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const [hover, setHover] = useState(false);
  const StatusIcon = statusConfig[task.status].icon;

  const cycleStatus = () => {
    const order: TaskStatus[] = ["Not Started", "In Progress", "Done", "Archived"];
    const nextIdx = (order.indexOf(task.status) + 1) % order.length;
    onStatusChange?.(task.id, order[nextIdx]);
  };

  return (
    <div
      className="group bg-white rounded-xl px-4 py-3 border border-mick-violet/8 hover:border-mick-violet/20 hover:shadow-mick-sm transition-all"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <button
          onClick={cycleStatus}
          className={`mt-0.5 w-7 h-7 rounded-lg ${statusConfig[task.status].bg} ${statusConfig[task.status].color} flex items-center justify-center hover:scale-110 transition flex-shrink-0`}
          title={`點擊切換 (目前：${task.status})`}
        >
          <StatusIcon size={14} className={task.status === "In Progress" ? "animate-spin" : ""} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${priorityDotColors[task.priority]}`}
              title={`優先度：${task.priority}`}
            />
            {task.projectName && (
              <span className="text-[10px] font-mono text-ink-mute tracking-wide truncate max-w-[200px]">
                {task.projectName}
              </span>
            )}
          </div>
          <div
            className={`text-sm font-medium leading-snug ${
              task.status === "Done" ? "line-through text-ink-mute" : "text-ink"
            }`}
          >
            {task.name}
          </div>
          {task.summary && (
            <div className="text-xs text-ink-mute mt-1 line-clamp-1">{task.summary}</div>
          )}
        </div>

        {/* Hover actions */}
        <div
          className={`flex items-center gap-1 transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}
        >
          <a
            href={task.url}
            target="_blank"
            rel="noopener"
            className="w-7 h-7 rounded-lg hover:bg-mick-violet/10 text-ink-mute hover:text-mick-violet flex items-center justify-center"
            title="在 Notion 開啟"
          >
            <ExternalLink size={13} />
          </a>
          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`封存「${task.name}」？`)) onDelete(task.id);
              }}
              className="w-7 h-7 rounded-lg hover:bg-rose-50 text-ink-mute hover:text-rose-600 flex items-center justify-center"
              title="封存"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
