// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Exercise Library · 集中出口
//
// 要新增動作：
//   1. 找對應分類檔（arms.ts / chest.ts / ...）
//   2. 在陣列尾端 push 新的 Exercise
//   3. id 用 kebab-case，stable forever（一旦排進使用者紀錄就不要改）
//   4. variation id 不需要重複 parent id，例如 "wide" 即可
//   5. 新檔案？把它加進這裡的 import + EXERCISE_LIBRARY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Exercise, ExerciseVariation } from "../types";
import { ARMS } from "./arms";
import { SHOULDERS } from "./shoulders";
import { CHEST } from "./chest";
import { CORE } from "./core";
import { LEGS } from "./legs";
import { BACK } from "./back";
import { FULL_BODY } from "./full-body";

export const EXERCISE_LIBRARY: Exercise[] = [
  ...ARMS,
  ...SHOULDERS,
  ...CHEST,
  ...CORE,
  ...LEGS,
  ...BACK,
  ...FULL_BODY,
];

// ─── Helpers ────────────────────────────────────────
export function getExercise(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.find((e) => e.id === id);
}

export function getVariation(
  exerciseId: string,
  variationId?: string
): ExerciseVariation | undefined {
  const ex = getExercise(exerciseId);
  if (!ex || !variationId || !ex.variations) return undefined;
  return ex.variations.find((v) => v.id === variationId);
}

export function exerciseDisplayName(
  exerciseId: string,
  variationId?: string
): string {
  const ex = getExercise(exerciseId);
  if (!ex) return exerciseId;
  if (!variationId) return ex.name_zh;
  const v = ex.variations?.find((x) => x.id === variationId);
  return v ? `${ex.name_zh} · ${v.name_zh}` : ex.name_zh;
}

export function findByCategory(category: Exercise["category"]) {
  return EXERCISE_LIBRARY.filter((e) => e.category === category);
}
