"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  ListTodo,
  CheckCircle2,
  Loader,
  Target,
  Plus,
  RefreshCw,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";
import type { Project, Task, TaskStatus } from "@/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  async function load() {
    const [pRes, tRes] = await Promise.all([
      fetch("/api/notion/projects", { cache: "no-store" }),
      fetch("/api/notion/tasks", { cache: "no-store" }),
    ]);
    const pData = await pRes.json();
    const tData = await tRes.json();
    setProjects(pData.projects ?? []);
    setTasks(tData.tasks ?? []);
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

  async function updateTaskStatus(id: string, status: TaskStatus) {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    await fetch("/api/notion/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  // Stats
  const totalProjects = projects.filter(
    (p) => p.status !== "Canceled" && p.status !== "Done"
  ).length;
  const totalTasks = tasks.filter((t) => t.status !== "Archived").length;
  const tasksDone = tasks.filter((t) => t.status === "Done").length;
  const tasksInProgress = tasks.filter((t) => t.status === "In Progress").length;
  const tasksNotStarted = tasks.filter((t) => t.status === "Not Started").length;
  const completionRate =
    totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  const targets2026 = projects.filter((p) => p.priority === "High").length;

  // Top priority tasks (not done, sorted by priority)
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  const topTasks = tasks
    .filter((t) => t.status !== "Done" && t.status !== "Archived")
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono tracking-[0.2em] text-mick-violet font-semibold uppercase">
              Dashboard · 儀表板
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold gradient-text leading-tight">
            米克宇宙戰情
          </h1>
          <p className="text-ink-soft mt-2 max-w-xl leading-relaxed">
            把想法、專案與任務接起來。資料源即時連動 Notion，AI 助手隨時可查。
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={sync}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-white border border-mick-violet/15 text-sm font-medium text-ink-soft hover:text-mick-violet hover:border-mick-violet/30 flex items-center gap-2 shadow-mick-sm"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            同步
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-mick-gradient text-white text-sm font-semibold shadow-mick-md hover:shadow-mick-glow flex items-center gap-2 hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            新增任務
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="六大主軸"
          value={totalProjects}
          icon={Sparkles}
          gradient="violet"
          subtitle={`${targets2026} 條為 2026 主戰場`}
        />
        <StatsCard
          label="進行中任務"
          value={tasksInProgress}
          icon={Loader}
          gradient="magenta"
          subtitle={`共 ${totalTasks} 個任務`}
        />
        <StatsCard
          label="待啟動"
          value={tasksNotStarted}
          icon={ListTodo}
          gradient="purple"
          subtitle="尚未開始的任務"
        />
        <StatsCard
          label="整體完成率"
          value={completionRate}
          suffix="%"
          icon={CheckCircle2}
          gradient="blue"
          subtitle={`已完成 ${tasksDone} 個`}
        />
      </div>

      {/* 2026 主戰場 Callout */}
      <div className="relative bg-white rounded-3xl p-6 border border-mick-violet/10 shadow-mick-sm overflow-hidden">
        <div className="absolute inset-0 bg-mick-gradient-soft opacity-50" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-mick-gradient flex items-center justify-center text-white shadow-mick-md flex-shrink-0">
            <Target size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-mick-violet font-bold uppercase">
                2026 MISSION
              </span>
            </div>
            <h2 className="font-display font-bold text-xl mb-2">今年的主戰場</h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              <span className="font-semibold text-mick-violet">FARMIQ ⭐⭐ 最優先</span> ·{" "}
              外部制度 ⭐ 試探期 · 內部制度 ⭐ 建構期 · 財務健康 ⭐ 建構期 <br />
              <span className="text-ink-mute">
                04 品牌內容暫緩 · 05 新業務儲備佈局（非急需）
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Six Axes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl">六大主軸</h2>
          <a
            href="/projects"
            className="text-sm text-mick-violet hover:underline font-medium"
          >
            檢視全部 →
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                taskCount={tasks.filter((t) => t.projectId === p.id).length}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Priority Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl">優先任務</h2>
          <a href="/tasks" className="text-sm text-mick-violet hover:underline font-medium">
            檢視全部 →
          </a>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {topTasks.length === 0 ? (
              <div className="text-center py-12 text-ink-mute">
                <ListTodo size={36} className="mx-auto mb-3 opacity-30" />
                <div className="text-sm">還沒有待辦任務，點右上「新增任務」開始</div>
              </div>
            ) : (
              topTasks.map((t) => (
                <TaskCard key={t.id} task={t} onStatusChange={updateTaskStatus} />
              ))
            )}
          </div>
        )}
      </div>

      <AddTaskModal
        projects={projects}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
