// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Restart Fit · Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Exercise library ────────────────────────────────
export type Category =
  | "手臂"
  | "肩膀"
  | "胸部"
  | "背部"
  | "腹部核心"
  | "大腿下肢"
  | "全身性";

export type MovementPattern =
  | "推"
  | "拉"
  | "蹲"
  | "髖鉸鏈"
  | "核心抗伸展"
  | "核心抗旋轉"
  | "核心屈曲"
  | "孤立訓練"
  | "心肺體能"
  | "複合動作";

export type Equipment =
  | "徒手"
  | "啞鈴"
  | "槓鈴"
  | "EZ槓"
  | "滑輪"
  | "繩索"
  | "機械"
  | "史密斯機"
  | "彈力帶"
  | "雙槓"
  | "引體向上桿"
  | "地雷管"
  | "T槓"
  | "六角槓"
  | "羅馬椅"
  | "跑步機"
  | "登階機"
  | "板凳"
  | "斜板"
  | "瑜伽墊";

export type Level = "新手" | "中階" | "進階";

export type ExerciseVariation = {
  id: string; // appended to parent id, e.g. "barbell-curl/wide"
  name_zh: string;
  emphasis_change?: string; // 「偏上胸」「偏二頭長頭」
  note?: string;
};

export type Exercise = {
  id: string; // kebab-case, stable forever (never rename)
  name_zh: string;
  name_en: string;
  category: Category;
  movement_pattern: MovementPattern;
  equipment: Equipment[];
  primary_muscles: string[];
  secondary_muscles: string[];
  muscle_emphasis_note: string;
  variations?: ExerciseVariation[];
  suitable_for: Level | "所有程度";
  fatigue_level: "低" | "中" | "高";
  skill_level: "低" | "中" | "高";
  ai_programming_note: string;
  // Recommended rep range for double progression
  default_rep_range?: [number, number];
  // For 1RM-style strength work
  is_compound_main?: boolean;
};

// ─── User & preferences ──────────────────────────────
export type Goal =
  | "減脂"
  | "增肌"
  | "恢復運動習慣"
  | "體態改善"
  | "力量提升"
  | "健康維持";

export type DietGoal = "減脂" | "維持" | "增肌";

export type ActivityLevel = "久坐" | "輕度活動" | "中度活動" | "高度活動";

export type TimeSlot = "早上" | "中午" | "下午" | "晚上" | "不固定";

export type UserTrainingPreference = {
  goal: Goal;
  weekly_sessions: 2 | 3 | 4 | 5 | 6;
  session_duration_minutes: 30 | 60 | 90 | 120;
  experience_level: Level;
  preferred_time_slot: TimeSlot;
  available_equipment: Equipment[];
  disliked_exercises?: string[];
  preferred_exercises?: string[];
  body_weight_kg?: number;
  target_weight_kg?: number;
  target_date?: string;
  diet_goal: DietGoal;
};

export type BodyGoal = {
  current_weight_kg: number;
  target_weight_kg: number;
  height_cm?: number;
  age?: number;
  sex?: "male" | "female" | "other";
  activity_level: ActivityLevel;
  goal: DietGoal;
  target_date?: string;
};

// ─── Prescription / generated plan ───────────────────
export type IntensityType = "RPE" | "RIR" | "percentage_1RM" | "estimated";

export type ExercisePrescription = {
  exercise_id: string;
  variation_id?: string;
  sets: number;
  reps: string; // "8-12" or "10" or "30s"
  rest_seconds: number;
  intensity_type: IntensityType;
  target_rpe?: number;
  target_rir?: number;
  suggested_weight?: number;
  note?: string;
};

export type GeneratedWorkoutExercise = {
  exercise_id: string;
  variation_id?: string;
  name_zh: string;
  sets: number;
  reps: string;
  suggested_weight?: number;
  rest_seconds: number;
  note: string;
};

export type GeneratedWorkout = {
  workout_id: string;
  title: string;
  goal: string;
  estimated_duration_minutes: number;
  focus_muscles: string[];
  exercises: GeneratedWorkoutExercise[];
  warmup?: string[];
  cooldown?: string[];
  ai_reasoning_summary: string;
};

// ─── Logs ────────────────────────────────────────────
export type SetFeeling =
  | "太輕鬆"
  | "剛剛好"
  | "有點吃力"
  | "太重"
  | "疼痛不適";

export type WorkoutSetLog = {
  exercise_id: string;
  variation_id?: string;
  date: string; // ISO yyyy-mm-dd
  set_number: number;
  weight: number; // kg, 0 = bodyweight
  reps: number;
  completed: boolean;
  rpe?: number;
  rir?: number;
  feeling: SetFeeling;
};

export type WorkoutAdjustmentRequest = {
  original_workout_id: string;
  user_feedback: string;
  adjustment_type:
    | "時間不足"
    | "疼痛不適"
    | "疲勞"
    | "想加強某部位"
    | "想替換動作"
    | "器材限制"
    | "其他";
};

export type ManualWorkoutEditLog = {
  workout_id: string;
  date: string;
  edited_field: string;
  old_value: string;
  new_value: string;
  reason?: string;
};

export type DailyCheckIn = {
  date: string;
  sleep_quality: 1 | 2 | 3 | 4 | 5;
  energy_level: 1 | 2 | 3 | 4 | 5;
  soreness_level: 1 | 2 | 3 | 4 | 5;
  stress_level: 1 | 2 | 3 | 4 | 5;
  motivation_level: 1 | 2 | 3 | 4 | 5;
  note?: string;
};

// ─── Progression suggestion output ───────────────────
export type ProgressionAction =
  | "increase_weight"
  | "hold"
  | "decrease_weight"
  | "swap"
  | "deload"
  | "add_set";

export type ProgressionSuggestion = {
  action: ProgressionAction;
  next_weight_kg?: number;
  pct_change?: number;
  reason: string;
  swap_to_id?: string;
};

// ─── Programming template (used by slot filler) ──────
export type SlotFocus =
  | "下肢推/蹲"
  | "髖鉸鏈"
  | "胸推"
  | "背部垂直拉"
  | "背部水平拉"
  | "肩推"
  | "肩部孤立"
  | "二頭"
  | "三頭"
  | "核心"
  | "心肺收尾"
  | "弱項"
  | "腿後/臀";

export type WorkoutSlot = {
  focus: SlotFocus;
  required_categories?: Category[];
  required_patterns?: MovementPattern[];
  primary: boolean; // 主動作 vs 輔助
  default_sets: number;
  default_rep_range: [number, number] | "time"; // [8,12] or "time" for plank etc.
  default_rest_sec: number;
  optional_in_30min?: boolean; // gets dropped at 30min
  add_in_90min?: boolean; // only added at 90+ min
  add_in_120min?: boolean;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  weekly_sessions: number;
  day_index: number; // 1, 2, 3...
  description: string;
  slots: WorkoutSlot[];
};

// ─── Nutrition ───────────────────────────────────────
export type NutritionTargets = {
  bmr_kcal: number;
  tdee_kcal: number;
  daily_kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  water_l: number;
  weekly_change_kg: number; // expected weekly weight change
  notes: string[]; // human-readable rules
};
