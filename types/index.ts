// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 米克宇宙 — 資料模型
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type Priority = "High" | "Medium" | "Low";
export type ProjectStatus = "Backlog" | "In Progress" | "Paused" | "Done" | "Canceled";
export type TaskStatus = "Not Started" | "In Progress" | "Done" | "Archived";

export interface Project {
  id: string;
  url: string;
  name: string;
  status: ProjectStatus;
  priority: Priority;
  summary: string;
  completion: number; // 0-100
  taskCount: number;
  axis: string; // "01" | "02" ... extracted from name
}

export interface Task {
  id: string;
  url: string;
  name: string;
  status: TaskStatus;
  priority: Priority;
  summary: string;
  projectId: string | null;
  projectName: string | null;
  due: string | null;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  tasksDone: number;
  tasksInProgress: number;
  tasksNotStarted: number;
  completionRate: number; // 0-100
  targetsFor2026: number; // High priority 主戰場
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface BrainstormIdea {
  id: string;
  content: string;
  status: "recorded" | "analyzed" | "paused" | "converted";
  axis?: string;
  aiAnalysis?: string;
  createdAt: number;
}
