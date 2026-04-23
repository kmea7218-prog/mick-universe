// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Claude API Client — 米克宇宙 AI 協作層
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Anthropic from "@anthropic-ai/sdk";
import type { Project, Task, ChatMessage } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

// ─── 米克憲法 System Prompt ────────────────────────────
const MICK_CONSTITUTION = `你是「米克」——大動物獸醫診所「米克乳牛專科診所」負責人 YU 的 AI 戰略協作夥伴。

【米克的目的】
讓生命被珍惜，讓價值不被浪費。

【米克的核心理念】
1. 認真面對每一頭牛、每一場問題、每一件事。
2. 專業不是廉價勞務，而是值得被尊重的價值。
3. 重視邏輯、數據與實力，不只靠經驗與感覺。
4. 珍惜每一位願意投入的夥伴，不讓熱情被白用。
5. 重視人與人的連結，對牛隻、牧場與產業保持責任感。

【米克的六大主軸（2026 主戰場標記）】
- 01 外部制度優化（酪農現場端）⭐ 試探期
- 02 內部制度優化 ⭐ 建構期
- 03 FARMIQ 數據工具 ⭐⭐ 最優先，試行期
- 04 品牌內容與對外認知 ── 維持進度，構想期
- 05 新業務構想 ── 儲備佈局
- 06 財務與營運健康 ⭐ 建構期

【FARMIQ 原則】先做好，再變現。第一版聚焦 IOFC + 場內繁殖數據。

【回答風格】
- 以思考夥伴身份回應，不只是資訊提供者
- 結構化、清晰、直接
- 提出可行動步驟與權衡
- 挑戰盲點，但保持建設性
- 若跟米克當前進度或主軸有關，會自然援引脈絡`;

// ─── 建立 Context ──────────────────────────────────────
function buildContext(projects: Project[], tasks: Task[]): string {
  const activeProjects = projects.filter((p) => p.status !== "Done" && p.status !== "Canceled");
  const highPriority = activeProjects.filter((p) => p.priority === "High");
  const activeTasks = tasks.filter((t) => t.status !== "Done" && t.status !== "Archived");

  const projectLines = activeProjects
    .map((p) => `  - ${p.name} [${p.status}, ${p.priority}] — 完成率 ${p.completion}%`)
    .join("\n");

  const taskLines = activeTasks
    .slice(0, 20)
    .map((t) => `  - ${t.name} [${t.status}, ${t.priority}]${t.projectName ? ` ← ${t.projectName}` : ""}`)
    .join("\n");

  return `
【當前狀態快照】

進行中主軸（${activeProjects.length} 條，其中 ${highPriority.length} 條為高優先）：
${projectLines || "  （無）"}

進行中任務（最多列 20 個）：
${taskLines || "  （無）"}
`;
}

// ─── 一般問答 ──────────────────────────────────────────
export async function chat(
  messages: ChatMessage[],
  projects: Project[],
  tasks: Task[]
): Promise<string> {
  const context = buildContext(projects, tasks);
  const systemPrompt = `${MICK_CONSTITUTION}\n\n${context}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const textBlock = response.content.find((b: any) => b.type === "text") as any;
  return textBlock?.text ?? "（無回應）";
}

// ─── 腦力激盪分析 ──────────────────────────────────────
export async function analyzeBrainstorm(
  idea: string,
  projects: Project[],
  tasks: Task[]
): Promise<{
  axis: string;
  suggestion: string;
  relatedProjects: string[];
  nextStep: string;
}> {
  const context = buildContext(projects, tasks);

  const prompt = `以下是 YU 剛剛寫下的一個想法：

「${idea}」

請以 JSON 格式回覆，分析這個想法（只回覆純 JSON，不要用 markdown code block，不要其他說明）：

{
  "axis": "最相關的主軸編號與名稱，例如 '03 FARMIQ'",
  "suggestion": "你對這個想法的回應與思考（3-5 句，不要空泛）",
  "relatedProjects": ["可能相關的現有專案名稱"],
  "nextStep": "具體的下一步建議（一句話，可行動）"
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `${MICK_CONSTITUTION}\n\n${context}`,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b: any) => b.type === "text") as any;
  const raw = textBlock?.text ?? "{}";

  // Strip markdown code fences if Claude added them despite instructions
  const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      axis: "--",
      suggestion: raw,
      relatedProjects: [],
      nextStep: "（解析失敗，請查看 suggestion）",
    };
  }
}
