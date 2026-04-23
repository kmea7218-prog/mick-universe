"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import type { Project, Task, TaskStatus, Priority } from "@/types";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";

export default function TasksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState<"all" | TaskStatus>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  async function updateStatus(id: string, status: TaskStatus) {
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

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterProject !== "all" && t.projectId !== filterProject) return false;
      if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterProject, searchQuery]);

  // Group by status for kanban-style
  const grouped: Record<string, Task[]> = {
    "Not Started": filtered.filter((t) => t.status === "Not Started"),
    "In Progress": filtered.filter((t) => t.status === "In Progress"),
    Done: filtered.filter((t) => t.status === "Done"),
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    "Not Started": { label: "待啟動", color: "from-ink-whisper/40 to-ink-whisper/20" },
    "In Progress": { label: "進行中", color: "from-mick-violet to-mick-purple" },
    Done: { label: "已完成", color: "from-emerald-400 to-emerald-500" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-[0.2em] text-mick-violet font-semibold uppercase">
            Tasks · 任務
          </span>
          <h1 className="font-display text-4xl font-bold gradient-text mt-1">任務列表</h1>
          <p className="text-ink-soft mt-2">
            共 {tasks.filter((t) => t.status !== "Archived").length} 個任務，
            {tasks.filter((t) => t.status === "Done").length} 已完成
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sync}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-white border border-mick-violet/15 text-sm font-medium text-ink-soft hover:text-mick-violet flex items-center gap-2 shadow-mick-sm"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            同步
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-mick-gradient text-white text-sm font-semibold shadow-mick-md flex items-center gap-2 hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            新增任務
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-mick-violet/8 shadow-mick-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋任務..."
              className="w-full pl-9 pr-3 py-2 bg-canvas-soft rounded-lg text-sm outline-none focus:ring-2 ring-mick-violet/30"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-canvas-soft rounded-lg text-sm outline-none"
          >
            <option value="all">所有狀態</option>
            <option value="Not Started">待啟動</option>
            <option value="In Progress">進行中</option>
            <option value="Done">已完成</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-2 bg-canvas-soft rounded-lg text-sm outline-none"
          >
            <option value="all">所有優先度</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 bg-canvas-soft rounded-lg text-sm outline-none max-w-[220px]"
          >
            <option value="all">所有主軸</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban columns */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([status, list]) => (
            <div
              key={status}
              className="bg-white rounded-2xl border border-mick-violet/8 overflow-hidden"
            >
              <div
                className={`px-4 py-3 bg-gradient-to-r ${statusConfig[status].color} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-display font-bold text-sm">
                    {statusConfig[status].label}
                  </div>
                  <div className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">
                    {list.length}
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
                {list.length === 0 ? (
                  <div className="text-center py-8 text-sm text-ink-mute">（無任務）</div>
                ) : (
                  list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onStatusChange={updateStatus}
                      onDelete={deleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTaskModal
        projects={projects}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
