"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, RefreshCw, Plus, Target, ExternalLink } from "lucide-react";
import type { Project, Task, ProjectStatus, Priority, TaskStatus } from "@/types";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [addDefaultProject, setAddDefaultProject] = useState<string | undefined>();

  async function load() {
    const [pRes, tRes] = await Promise.all([
      fetch("/api/notion/projects", { cache: "no-store" }),
      fetch("/api/notion/tasks", { cache: "no-store" }),
    ]);
    setProjects((await pRes.json()).projects ?? []);
    setTasks((await tRes.json()).tasks ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function sync() {
    setSyncing(true);
    await load();
    setSyncing(false);
  }

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function updateProjectStatus(id: string, status: ProjectStatus) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    await fetch("/api/notion/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  async function updateProjectPriority(id: string, priority: Priority) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, priority } : p)));
    await fetch("/api/notion/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, priority }),
    });
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    await fetch("/api/notion/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch("/api/notion/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const priorityColors: Record<Priority, string> = {
    High: "bg-gradient-to-r from-mick-violet to-mick-magenta text-white",
    Medium: "bg-mick-purple/20 text-mick-purple",
    Low: "bg-mick-blue/15 text-mick-blue",
  };

  const statusOptions: ProjectStatus[] = [
    "Backlog",
    "In Progress",
    "Paused",
    "Done",
    "Canceled",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-[0.2em] text-mick-violet font-semibold uppercase">
            Axes · 主軸
          </span>
          <h1 className="font-display text-4xl font-bold gradient-text mt-1">六大主軸</h1>
          <p className="text-ink-soft mt-2 max-w-xl">
            展開主軸可看所屬任務。點擊狀態或優先度標籤可直接修改並同步回 Notion。
          </p>
        </div>
        <button
          onClick={sync}
          disabled={syncing}
          className="px-4 py-2.5 rounded-xl bg-white border border-mick-violet/15 text-sm font-medium text-ink-soft hover:text-mick-violet flex items-center gap-2 shadow-mick-sm"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
          同步
        </button>
      </div>

      {/* Projects list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-2xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => {
            const isOpen = expanded.has(p.id);
            const projectTasks = tasks.filter((t) => t.projectId === p.id);
            const is2026Target = p.priority === "High";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-mick-violet/8 shadow-mick-sm overflow-hidden"
              >
                <button
                  onClick={() => toggle(p.id)}
                  className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-canvas-soft/50 transition"
                >
                  <div className="mt-1 text-ink-mute">
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {is2026Target && (
                        <Target size={12} className="text-mick-magenta" />
                      )}
                      <span
                        className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md ${priorityColors[p.priority]}`}
                      >
                        {p.priority}
                      </span>
                      <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-canvas-cool text-ink-soft">
                        {p.status}
                      </span>
                      <span className="text-[10px] text-ink-mute">
                        {projectTasks.length} 個任務
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg">{p.name}</h3>
                    {p.summary && (
                      <p className="text-sm text-ink-soft mt-1 line-clamp-2">{p.summary}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-mick-violet text-sm">
                        {p.completion}%
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-canvas-cool mt-1 overflow-hidden">
                        <div
                          className="h-full bg-mick-gradient transition-all"
                          style={{ width: `${p.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-mick-violet/8 bg-canvas-soft/30 p-5 space-y-4">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-ink-mute uppercase mb-1 block">
                          Status
                        </label>
                        <select
                          value={p.status}
                          onChange={(e) =>
                            updateProjectStatus(p.id, e.target.value as ProjectStatus)
                          }
                          className="px-3 py-1.5 bg-white rounded-lg text-sm border border-mick-violet/15 outline-none focus:ring-2 ring-mick-violet/30"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-ink-mute uppercase mb-1 block">
                          Priority
                        </label>
                        <div className="flex gap-1">
                          {(["High", "Medium", "Low"] as Priority[]).map((pr) => (
                            <button
                              key={pr}
                              onClick={() => updateProjectPriority(p.id, pr)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                p.priority === pr
                                  ? "bg-mick-gradient text-white"
                                  : "bg-white border border-mick-violet/15 text-ink-soft hover:text-mick-violet"
                              }`}
                            >
                              {pr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1" />

                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener"
                        className="px-3 py-1.5 rounded-lg bg-white border border-mick-violet/15 text-xs text-ink-soft hover:text-mick-violet flex items-center gap-1.5"
                      >
                        <ExternalLink size={12} /> Notion
                      </a>
                      <button
                        onClick={() => {
                          setAddDefaultProject(p.id);
                          setAddOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-mick-gradient text-white text-xs font-semibold flex items-center gap-1.5 shadow-mick-sm"
                      >
                        <Plus size={12} /> 新增任務到此主軸
                      </button>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {projectTasks.length === 0 ? (
                        <div className="text-sm text-ink-mute text-center py-8">
                          此主軸還沒有任務
                        </div>
                      ) : (
                        projectTasks.map((t) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            onStatusChange={updateTaskStatus}
                            onDelete={deleteTask}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddTaskModal
        projects={projects}
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setAddDefaultProject(undefined);
        }}
        onCreated={load}
        defaultProjectId={addDefaultProject}
      />
    </div>
  );
}
