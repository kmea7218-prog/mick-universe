import type {
  Exercise,
  GeneratedWorkout,
  GeneratedWorkoutExercise,
  Goal,
  UserTrainingPreference,
  WorkoutSlot,
  WorkoutTemplate,
} from "../types";
import { EXERCISE_LIBRARY, exerciseDisplayName } from "../exercises";
import { TEMPLATES, getWeeklyPlan } from "./templates";
import { pickExercise, repRangeText } from "./slot-filler";
import { scaleSlotsToDuration, estimateTotalMinutes } from "./time-scaler";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// generateWorkout — pure deterministic; AI explanation comes later.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function repsForGoal(goal: Goal, slot: WorkoutSlot): string {
  if (slot.default_rep_range === "time") return "30-45 秒";
  let [lo, hi] = slot.default_rep_range;
  if (goal === "力量提升" && slot.primary) {
    lo = Math.max(3, lo - 2);
    hi = Math.max(6, hi - 4);
  }
  if (goal === "減脂" && !slot.primary) {
    lo = Math.max(8, lo);
    hi = Math.max(12, hi);
  }
  if (goal === "恢復運動習慣") {
    lo = Math.max(8, lo);
    hi = Math.max(12, hi);
  }
  return `${lo}-${hi}`;
}

function rpeForGoal(goal: Goal, primary: boolean): number {
  if (goal === "恢復運動習慣") return 6.5;
  if (goal === "力量提升") return primary ? 8 : 7;
  if (goal === "增肌") return primary ? 8 : 7;
  if (goal === "減脂") return 7;
  return 7;
}

function setsForGoal(goal: Goal, slot: WorkoutSlot): number {
  let s = slot.default_sets;
  if (goal === "恢復運動習慣") s = Math.max(2, s - 1);
  if (goal === "增肌" && slot.primary) s = Math.min(5, s + 1);
  return s;
}

function noteForExercise(ex: Exercise, primary: boolean, goal: Goal): string {
  const parts: string[] = [];
  if (goal === "恢復運動習慣") parts.push("不做到力竭，留 2-3 下力量");
  if (primary && ex.is_compound_main) parts.push("專注動作品質");
  if (ex.muscle_emphasis_note) parts.push(ex.muscle_emphasis_note.split("。")[0]);
  return parts.join("；");
}

export type GeneratePlanInput = {
  template_id?: string; // override; otherwise auto-pick by day rotation
  user: UserTrainingPreference;
  day_index?: number; // 1-based; defaults to 1
};

export function generateWorkoutFromTemplate(
  template: WorkoutTemplate,
  user: UserTrainingPreference
): GeneratedWorkout {
  const scaledSlots = scaleSlotsToDuration(template.slots, user.session_duration_minutes);
  const picked: string[] = [];
  const exercises: GeneratedWorkoutExercise[] = [];

  for (const slot of scaledSlots) {
    const ex = pickExercise(slot, user, EXERCISE_LIBRARY, picked);
    if (!ex) continue;
    picked.push(ex.id);
    const sets = setsForGoal(user.goal, slot);
    const reps =
      slot.default_rep_range === "time"
        ? "30-45 秒"
        : repsForGoal(user.goal, slot);
    exercises.push({
      exercise_id: ex.id,
      name_zh: ex.name_zh,
      sets,
      reps,
      rest_seconds: slot.default_rest_sec,
      note: noteForExercise(ex, slot.primary, user.goal),
    });
  }

  const focusMuscles = Array.from(
    new Set(
      exercises.flatMap((e) => {
        const ex = EXERCISE_LIBRARY.find((x) => x.id === e.exercise_id);
        return ex ? ex.primary_muscles : [];
      })
    )
  );

  const reasoning = buildReasoning(template, user, exercises.length);

  return {
    workout_id: `${template.id}-${Date.now()}`,
    title: template.name,
    goal: user.goal,
    estimated_duration_minutes: estimateTotalMinutes(scaledSlots),
    focus_muscles: focusMuscles,
    exercises,
    warmup: ["5 分鐘輕鬆有氧（單車或快走）", "動態伸展：肩繞環、髖繞環各 10 下"],
    cooldown: ["主要訓練部位靜態伸展 30 秒 × 2"],
    ai_reasoning_summary: reasoning,
  };
}

function buildReasoning(
  template: WorkoutTemplate,
  user: UserTrainingPreference,
  exerciseCount: number
): string {
  const parts: string[] = [];
  parts.push(
    `今天安排「${template.name}」，配合你 ${user.weekly_sessions} 練/週的節奏`
  );
  parts.push(`目標 ${user.goal}，時間設定 ${user.session_duration_minutes} 分鐘`);
  if (user.session_duration_minutes <= 30) {
    parts.push(`時間有限，所以只保留主動作 + 必要輔助，共 ${exerciseCount} 項`);
  } else {
    parts.push(`包含 ${exerciseCount} 項動作，含主動作與輔助`);
  }
  if (user.goal === "恢復運動習慣") {
    parts.push("強度設保守（RPE 6-7、不力竭），優先建立習慣");
  }
  return parts.join("；") + "。";
}

// ─── 高層介面：用 day_index 取得當週某天課表 ────────
export function generateForDay(input: GeneratePlanInput): GeneratedWorkout | null {
  const plan = getWeeklyPlan(input.user.weekly_sessions);
  if (plan.length === 0) return null;
  const day = ((input.day_index ?? 1) - 1) % plan.length;
  const tpl = input.template_id
    ? TEMPLATES.find((t) => t.id === input.template_id)
    : plan[day];
  if (!tpl) return null;
  return generateWorkoutFromTemplate(tpl, input.user);
}

export { TEMPLATES, getWeeklyPlan };
