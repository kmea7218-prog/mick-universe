import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { EXERCISE_LIBRARY } from "@/lib/restart-fit/exercises";
import { generateForDay } from "@/lib/restart-fit/programming";
import type {
  GeneratedWorkout,
  UserTrainingPreference,
} from "@/lib/restart-fit/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Workout adjustment via natural language.
//
// Strategy:
//  1. Classify the user's request into a structured intent (rule-based).
//  2. Apply deterministic rules (swap exercise, drop sets, regen for shorter time).
//  3. Ask Claude to write a short ai_reasoning_summary in 陪伴語氣.
//
// We DO NOT let Claude regenerate the whole workout from scratch — too unpredictable.
// Claude only labels the change.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type AdjustType =
  | "時間不足"
  | "疼痛不適"
  | "疲勞"
  | "想加強某部位"
  | "想替換動作"
  | "器材限制"
  | "其他";

function classifyFeedback(text: string): { type: AdjustType; details: Record<string, any> } {
  const t = text.toLowerCase();
  const details: Record<string, any> = {};

  // 時間不足
  const timeMatch = text.match(/(\d+)\s*分鐘/);
  if (timeMatch || /時間/.test(text) || /只有.*分/.test(text)) {
    if (timeMatch) details.minutes = +timeMatch[1];
    return { type: "時間不足", details };
  }

  // 疼痛
  if (/痛|不適|怪怪|受傷|拉傷|閃到/.test(text)) {
    if (/肩/.test(text)) details.body_part = "肩膀";
    else if (/膝/.test(text)) details.body_part = "膝蓋";
    else if (/腰|下背/.test(text)) details.body_part = "下背";
    else if (/手腕/.test(text)) details.body_part = "手腕";
    else if (/肘/.test(text)) details.body_part = "手肘";
    return { type: "疼痛不適", details };
  }

  // 疲勞
  if (/累|疲|沒精神|睡不好|沒睡|沒體力/.test(text)) return { type: "疲勞", details };

  // 想加強某部位
  if (/想加強|想多練|多練|加強/.test(text)) {
    if (/胸/.test(text)) details.target = "胸部";
    else if (/背/.test(text)) details.target = "背部";
    else if (/肩/.test(text)) details.target = "肩膀";
    else if (/腿|下肢|蹲/.test(text)) details.target = "大腿下肢";
    else if (/手臂|二頭|三頭/.test(text)) details.target = "手臂";
    else if (/核心|腹/.test(text)) details.target = "腹部核心";
    return { type: "想加強某部位", details };
  }

  // 器材限制
  if (/只有|沒有|不能用|沒.*器材/.test(text)) {
    if (/啞鈴/.test(text)) details.has_dumbbell = true;
    if (/滑輪/.test(text)) details.has_cable = true;
    if (/機械/.test(text)) details.has_machine = true;
    return { type: "器材限制", details };
  }

  // 不想做某動作
  if (/不想做|不要做|跳過|換掉|避開/.test(text)) {
    if (/深蹲/.test(text)) details.skip_id = "back-squat";
    if (/硬舉/.test(text)) details.skip_id = "deadlift";
    if (/臥推/.test(text)) details.skip_id = "barbell-bench-press";
    return { type: "想替換動作", details };
  }

  // 沒感覺
  if (/沒感覺|沒練到|練不到/.test(text)) return { type: "想替換動作", details };

  return { type: "其他", details };
}

function adjustWorkout(
  workout: GeneratedWorkout,
  intent: { type: AdjustType; details: Record<string, any> },
  user: UserTrainingPreference
): GeneratedWorkout {
  const updated: GeneratedWorkout = JSON.parse(JSON.stringify(workout));

  if (intent.type === "時間不足") {
    const targetMin = intent.details.minutes ?? 30;
    // simple heuristic: keep first N exercises proportional
    const ratio = targetMin / Math.max(1, workout.estimated_duration_minutes);
    const keep = Math.max(2, Math.round(updated.exercises.length * ratio));
    updated.exercises = updated.exercises.slice(0, keep).map((e) =>
      e.sets > 2 ? { ...e, sets: e.sets - 1 } : e
    );
    updated.estimated_duration_minutes = targetMin;
    updated.title = `${workout.title}（縮短版）`;
  }

  if (intent.type === "疲勞") {
    updated.exercises = updated.exercises.map((e) => ({
      ...e,
      sets: Math.max(1, e.sets - 1),
      note: e.note + "；今日減量",
    }));
    updated.title = `${workout.title}（恢復版）`;
  }

  if (intent.type === "疼痛不適") {
    const part = intent.details.body_part as string | undefined;
    // Drop all exercises that load the painful body part heavily
    updated.exercises = updated.exercises.filter((e) => {
      const ex = EXERCISE_LIBRARY.find((x) => x.id === e.exercise_id);
      if (!ex) return true;
      if (part === "肩膀") return !ex.primary_muscles.some((m) => m.includes("肩"));
      if (part === "膝蓋") return !["蹲"].includes(ex.movement_pattern);
      if (part === "下背") return !["髖鉸鏈"].includes(ex.movement_pattern);
      if (part === "手腕") return !ex.equipment.includes("槓鈴");
      if (part === "手肘") return ex.movement_pattern !== "孤立訓練" || !ex.primary_muscles.some((m) => m.includes("二頭") || m.includes("三頭"));
      return true;
    });
    updated.title = `${workout.title}（避開${part || "不適部位"}）`;
  }

  if (intent.type === "想替換動作" && intent.details.skip_id) {
    const skip = intent.details.skip_id;
    updated.exercises = updated.exercises.filter((e) => e.exercise_id !== skip);
    // try to add an alternative
    const skipped = EXERCISE_LIBRARY.find((x) => x.id === skip);
    if (skipped) {
      const alt = EXERCISE_LIBRARY.find(
        (x) =>
          x.id !== skip &&
          x.category === skipped.category &&
          x.movement_pattern === skipped.movement_pattern &&
          x.equipment.some((eq) => user.available_equipment.includes(eq) || eq === "徒手") &&
          x.skill_level !== "高"
      );
      if (alt) {
        updated.exercises.push({
          exercise_id: alt.id,
          name_zh: alt.name_zh,
          sets: 3,
          reps: alt.default_rep_range ? `${alt.default_rep_range[0]}-${alt.default_rep_range[1]}` : "8-12",
          rest_seconds: 90,
          note: `替換 ${skipped.name_zh}`,
        });
      }
    }
  }

  if (intent.type === "想加強某部位" && intent.details.target) {
    const target = intent.details.target as string;
    const extra = EXERCISE_LIBRARY.find(
      (x) =>
        x.category === target &&
        x.equipment.some((eq) => user.available_equipment.includes(eq) || eq === "徒手") &&
        x.skill_level !== "高" &&
        !updated.exercises.some((e) => e.exercise_id === x.id)
    );
    if (extra) {
      updated.exercises.push({
        exercise_id: extra.id,
        name_zh: extra.name_zh,
        sets: 3,
        reps: extra.default_rep_range ? `${extra.default_rep_range[0]}-${extra.default_rep_range[1]}` : "10-12",
        rest_seconds: 90,
        note: `加強 ${target}`,
      });
    }
  }

  return updated;
}

export async function POST(req: NextRequest) {
  try {
    const { workout, user, feedback, day_index } = (await req.json()) as {
      workout?: GeneratedWorkout;
      user: UserTrainingPreference;
      feedback: string;
      day_index?: number;
    };

    let original = workout;
    if (!original) {
      original = generateForDay({ user, day_index }) || undefined;
    }
    if (!original) {
      return NextResponse.json({ error: "no workout" }, { status: 400 });
    }

    const intent = classifyFeedback(feedback || "");
    const adjusted = adjustWorkout(original, intent, user);

    // Ask Claude for the friendly reasoning (with timeout fallback)
    let reasoning = `根據「${feedback}」做了調整：${intent.type}`;
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const r = await client.messages.create({
          model: MODEL,
          max_tokens: 256,
          system:
            "你是 Restart Fit 的陪伴型 AI 教練。用 1-3 句中文（繁體）解釋為什麼這樣調整，溫暖直接，不要施壓、不要誇獎太多。不要列出動作清單。",
          messages: [
            {
              role: "user",
              content: `使用者反饋：「${feedback}」\n意圖分類：${intent.type}\n調整後課表名稱：${adjusted.title}\n動作數：${adjusted.exercises.length}（原 ${original.exercises.length}）\n請用一段話告訴使用者你做了什麼調整、為什麼。`,
            },
          ],
        });
        const text = (r.content.find((b: any) => b.type === "text") as any)?.text;
        if (text) reasoning = text.trim();
      } catch {
        // fall through to default
      }
    }

    adjusted.ai_reasoning_summary = reasoning;
    return NextResponse.json({
      original_workout_id: original.workout_id,
      adjustment_type: intent.type,
      adjusted,
      diff: {
        original_exercise_ids: original.exercises.map((e) => e.exercise_id),
        new_exercise_ids: adjusted.exercises.map((e) => e.exercise_id),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "adjust error" }, { status: 500 });
  }
}
