import type { Exercise, UserTrainingPreference, WorkoutSlot, SlotFocus } from "../types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pick the best exercise for a slot, given user prefs.
//
// Filters:
//  - required category (if set)
//  - required movement pattern (if set)
//  - user equipment (徒手 always available)
//  - user level (suitable_for)
//  - not in disliked list
//
// Ranking (lower score = better):
//  - in preferred list:        -100
//  - matches focus muscle:      -10
//  - is_compound_main matches:   -5
//  - skill_level low (新手):     -3 / 中: 0 / 高: +3
//  - 恢復習慣 + 機械 / 徒手:    -3
//  - 增肌 + is_compound_main:   -3
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FOCUS_MUSCLE_HINTS: Record<SlotFocus, string[]> = {
  "下肢推/蹲": ["股四頭肌"],
  "髖鉸鏈": ["腿後肌群", "臀大肌"],
  "胸推": ["胸大肌", "上胸"],
  "背部垂直拉": ["背闊肌"],
  "背部水平拉": ["中背", "背闊肌"],
  "肩推": ["肩前束", "肩中束"],
  "肩部孤立": ["肩中束", "肩後束"],
  "二頭": ["二頭肌"],
  "三頭": ["三頭肌"],
  "核心": ["腹直肌", "腹橫肌", "腹斜肌"],
  "心肺收尾": ["心肺", "全身"],
  "弱項": [],
  "腿後/臀": ["腿後肌群", "臀大肌"],
};

const LEVEL_RANK: Record<string, number> = {
  "新手": 0,
  "中階": 1,
  "進階": 2,
  "所有程度": 0,
};

function userCanUseEquipment(ex: Exercise, userEquip: string[]): boolean {
  // 徒手 always available
  if (ex.equipment.includes("徒手")) return true;
  // need at least one matching piece
  return ex.equipment.some((e) => userEquip.includes(e));
}

function levelOk(ex: Exercise, level: string): boolean {
  if (ex.suitable_for === "所有程度") return true;
  return LEVEL_RANK[ex.suitable_for] <= LEVEL_RANK[level];
}

export function pickExercise(
  slot: WorkoutSlot,
  user: UserTrainingPreference,
  library: Exercise[],
  alreadyPicked: string[] = [] // exercise ids picked earlier this session
): Exercise | null {
  let candidates = library.filter((ex) => {
    if (slot.required_categories && !slot.required_categories.includes(ex.category)) return false;
    if (slot.required_patterns && !slot.required_patterns.includes(ex.movement_pattern)) return false;
    if (!userCanUseEquipment(ex, user.available_equipment)) return false;
    if (!levelOk(ex, user.experience_level)) return false;
    if (user.disliked_exercises?.includes(ex.id)) return false;
    if (alreadyPicked.includes(ex.id)) return false;
    return true;
  });

  if (candidates.length === 0) {
    // fall back: ignore equipment, pick anything matching
    candidates = library.filter((ex) => {
      if (slot.required_categories && !slot.required_categories.includes(ex.category)) return false;
      if (slot.required_patterns && !slot.required_patterns.includes(ex.movement_pattern)) return false;
      if (alreadyPicked.includes(ex.id)) return false;
      return true;
    });
  }
  if (candidates.length === 0) return null;

  const focusMuscles = FOCUS_MUSCLE_HINTS[slot.focus] || [];

  function score(ex: Exercise): number {
    let s = 0;
    if (user.preferred_exercises?.includes(ex.id)) s -= 100;
    if (focusMuscles.some((m) => ex.primary_muscles.some((pm) => pm.includes(m)))) s -= 10;
    if (slot.primary && ex.is_compound_main) s -= 5;
    if (!slot.primary && ex.is_compound_main) s += 3; // 輔助動作不要再用大複合動作
    s += LEVEL_RANK[ex.suitable_for] * 2;
    if (ex.skill_level === "低") s -= 1;
    if (ex.skill_level === "高") s += 2;
    if (user.goal === "恢復運動習慣") {
      if (ex.equipment.some((e) => e === "機械" || e === "徒手")) s -= 3;
      if (ex.skill_level === "低") s -= 2;
      if (ex.fatigue_level === "高") s += 2;
    }
    if (user.goal === "力量提升" && slot.primary && ex.is_compound_main) s -= 5;
    if (user.goal === "增肌" && slot.primary && ex.is_compound_main) s -= 3;
    return s;
  }

  candidates.sort((a, b) => score(a) - score(b));
  return candidates[0];
}

export function repRangeText(range: [number, number] | "time"): string {
  if (range === "time") return "30-45 秒";
  return `${range[0]}-${range[1]} 下`;
}
