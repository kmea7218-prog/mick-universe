// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Notion API Client — 米克宇宙資料層
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Client } from "@notionhq/client";
import type { Project, Task, Priority, ProjectStatus, TaskStatus } from "@/types";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const PROJECTS_DS = process.env.NOTION_PROJECTS_DS!;
const TASKS_DS = process.env.NOTION_TASKS_DS!;

// ─── Helpers ──────────────────────────────────────────
function getTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? prop?.title?.map((t: any) => t.plain_text).join("") ?? "";
}
function getText(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
}
function getSelect(prop: any): string {
  return prop?.select?.name ?? "";
}
function getStatus(prop: any): string {
  return prop?.status?.name ?? "";
}
function getRelationIds(prop: any): string[] {
  return prop?.relation?.map((r: any) => r.id) ?? [];
}
function getRollupNumber(prop: any): number {
  const n = prop?.rollup?.number;
  return typeof n === "number" ? Math.round(n * 100) : 0;
}
function getDate(prop: any): string | null {
  return prop?.date?.start ?? null;
}

function extractAxis(name: string): string {
  const match = name.match(/^(\d{2})/);
  return match ? match[1] : "--";
}

// ─── Projects ─────────────────────────────────────────
export async function fetchProjects(): Promise<Project[]> {
  const res = await notion.databases.query({
    database_id: PROJECTS_DS,
    sorts: [{ property: "Project name", direction: "ascending" }],
  });

  return res.results.map((page: any) => {
    const props = page.properties;
    const name = getTitle(props["Project name"]);
    return {
      id: page.id,
      url: page.url,
      name,
      status: (getStatus(props.Status) || "Backlog") as ProjectStatus,
      priority: (getSelect(props.Priority) || "Medium") as Priority,
      summary: getText(props.Summary),
      completion: getRollupNumber(props.Completion),
      taskCount: getRelationIds(props.Tasks).length,
      axis: extractAxis(name),
    };
  });
}

export async function createProject(data: {
  name: string;
  priority?: Priority;
  summary?: string;
}): Promise<Project> {
  const res: any = await notion.pages.create({
    parent: { database_id: PROJECTS_DS },
    properties: {
      "Project name": { title: [{ text: { content: data.name } }] },
      Priority: { select: { name: data.priority ?? "Medium" } },
      Status: { status: { name: "Backlog" } },
      Summary: { rich_text: [{ text: { content: data.summary ?? "" } }] },
    },
  });
  return {
    id: res.id,
    url: res.url,
    name: data.name,
    status: "Backlog",
    priority: data.priority ?? "Medium",
    summary: data.summary ?? "",
    completion: 0,
    taskCount: 0,
    axis: extractAxis(data.name),
  };
}

export async function updateProject(
  id: string,
  data: { status?: ProjectStatus; priority?: Priority; summary?: string; name?: string }
) {
  const properties: any = {};
  if (data.status) properties.Status = { status: { name: data.status } };
  if (data.priority) properties.Priority = { select: { name: data.priority } };
  if (data.summary !== undefined)
    properties.Summary = { rich_text: [{ text: { content: data.summary } }] };
  if (data.name) properties["Project name"] = { title: [{ text: { content: data.name } }] };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteProject(id: string) {
  await notion.pages.update({ page_id: id, archived: true });
}

// ─── Tasks ────────────────────────────────────────────
export async function fetchTasks(): Promise<Task[]> {
  const res = await notion.databases.query({
    database_id: TASKS_DS,
    sorts: [{ property: "Task name", direction: "ascending" }],
  });

  // Build project lookup
  const projects = await fetchProjects();
  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  return res.results.map((page: any) => {
    const props = page.properties;
    const projectIds = getRelationIds(props.Project);
    const projectId = projectIds[0] ?? null;
    return {
      id: page.id,
      url: page.url,
      name: getTitle(props["Task name"]),
      status: (getStatus(props.Status) || "Not Started") as TaskStatus,
      priority: (getSelect(props.Priority) || "Medium") as Priority,
      summary: getText(props.Summary),
      projectId,
      projectName: projectId ? projectMap.get(projectId) ?? null : null,
      due: getDate(props.Due),
    };
  });
}

export async function createTask(data: {
  name: string;
  projectId?: string;
  priority?: Priority;
  summary?: string;
  due?: string;
}): Promise<Task> {
  const properties: any = {
    "Task name": { title: [{ text: { content: data.name } }] },
    Status: { status: { name: "Not Started" } },
    Priority: { select: { name: data.priority ?? "Medium" } },
    Summary: { rich_text: [{ text: { content: data.summary ?? "" } }] },
  };
  if (data.projectId) properties.Project = { relation: [{ id: data.projectId }] };
  if (data.due) properties.Due = { date: { start: data.due } };

  const res: any = await notion.pages.create({
    parent: { database_id: TASKS_DS },
    properties,
  });

  return {
    id: res.id,
    url: res.url,
    name: data.name,
    status: "Not Started",
    priority: data.priority ?? "Medium",
    summary: data.summary ?? "",
    projectId: data.projectId ?? null,
    projectName: null,
    due: data.due ?? null,
  };
}

export async function updateTask(
  id: string,
  data: { status?: TaskStatus; priority?: Priority; summary?: string; name?: string }
) {
  const properties: any = {};
  if (data.status) properties.Status = { status: { name: data.status } };
  if (data.priority) properties.Priority = { select: { name: data.priority } };
  if (data.summary !== undefined)
    properties.Summary = { rich_text: [{ text: { content: data.summary } }] };
  if (data.name) properties["Task name"] = { title: [{ text: { content: data.name } }] };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteTask(id: string) {
  await notion.pages.update({ page_id: id, archived: true });
}
