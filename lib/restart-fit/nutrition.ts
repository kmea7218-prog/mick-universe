import type { ActivityLevel, BodyGoal, NutritionTargets } from "./types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Nutrition · BMR / TDEE / Macros
//
// BMR (Mifflin-St Jeor):
//   male:   10w + 6.25h - 5a + 5
//   female: 10w + 6.25h - 5a - 161
//   other:  average of male/female
//
// Activity multiplier:
//   久坐:        1.20  (no exercise)
//   輕度活動:    1.375 (1-3 days/week)
//   中度活動:    1.55  (3-5 days/week)
//   高度活動:    1.725 (6-7 days/week)
//
// Goal adjustment:
//   減脂:  TDEE - 400 (range -300 to -500)
//   維持:  TDEE
//   增肌:  TDEE + 250 (range +200 to +300)
//
// Protein:
//   減脂 / 增肌:  1.8 g/kg (range 1.6-2.2)
//   維持:         1.6 g/kg
//
// Fat:    0.8 g/kg
// Carb:   remainder
// Water:  weight × 33 ml ≈ ~2.5 L for 75 kg
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ACTIVITY_MULT: Record<ActivityLevel, number> = {
  久坐: 1.20,
  輕度活動: 1.375,
  中度活動: 1.55,
  高度活動: 1.725,
};

export function computeBMR(
  weightKg: number,
  heightCm: number = 170,
  age: number = 30,
  sex: "male" | "female" | "other" = "male"
): number {
  if (sex === "female") return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  if (sex === "male") return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  // other → midpoint
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
}

export function computeNutrition(goal: BodyGoal): NutritionTargets {
  const { current_weight_kg: w, height_cm: h = 170, age = 30, sex = "male", activity_level } = goal;
  const bmr = Math.round(computeBMR(w, h, age, sex));
  const tdee = Math.round(bmr * ACTIVITY_MULT[activity_level]);

  let dailyKcal = tdee;
  let weeklyChangeKg = 0;
  if (goal.goal === "減脂") {
    dailyKcal = tdee - 400;
    weeklyChangeKg = -0.4;
  } else if (goal.goal === "增肌") {
    dailyKcal = tdee + 250;
    weeklyChangeKg = +0.25;
  }
  // round to nearest 50
  dailyKcal = Math.round(dailyKcal / 50) * 50;
  // safety floor
  dailyKcal = Math.max(1200, dailyKcal);

  // Protein
  const proteinPerKg = goal.goal === "維持" ? 1.6 : 1.8;
  const protein_g = Math.round(w * proteinPerKg);

  // Fat 0.8 g/kg, but min 50g for adult
  const fat_g = Math.max(50, Math.round(w * 0.8));

  // Carb = remainder
  const carbKcal = dailyKcal - (protein_g * 4 + fat_g * 9);
  const carb_g = Math.max(80, Math.round(carbKcal / 4));

  const water_l = Math.max(1.5, Math.round((w * 33) / 100) / 10);

  const notes: string[] = [];
  if (goal.goal === "減脂") {
    notes.push("每日熱量約 TDEE - 300 ~ 500 kcal");
    notes.push("不要極端節食，保持訓練強度");
    notes.push("每週合理減脂 0.3-0.5 kg");
  } else if (goal.goal === "增肌") {
    notes.push("每日熱量約 TDEE + 200 ~ 300 kcal");
    notes.push("每週合理增重 0.2-0.3 kg");
    notes.push("體重不變則略加 100 kcal");
  } else {
    notes.push("接近 TDEE，依訓練表現微調");
  }
  notes.push(`蛋白質 ${proteinPerKg} g/kg 體重`);

  return {
    bmr_kcal: bmr,
    tdee_kcal: tdee,
    daily_kcal: dailyKcal,
    protein_g,
    carb_g,
    fat_g,
    water_l,
    weekly_change_kg: weeklyChangeKg,
    notes,
  };
}

// Helper to convert from UserTrainingPreference + body data
export function nutritionFromPreference(opts: {
  weight_kg: number;
  target_weight_kg?: number;
  height_cm?: number;
  age?: number;
  sex?: "male" | "female" | "other";
  weekly_sessions: number;
  diet_goal: "減脂" | "維持" | "增肌";
}): NutritionTargets {
  const activity: ActivityLevel =
    opts.weekly_sessions <= 1 ? "久坐"
    : opts.weekly_sessions <= 3 ? "輕度活動"
    : opts.weekly_sessions <= 5 ? "中度活動"
    : "高度活動";
  return computeNutrition({
    current_weight_kg: opts.weight_kg,
    target_weight_kg: opts.target_weight_kg ?? opts.weight_kg,
    height_cm: opts.height_cm,
    age: opts.age,
    sex: opts.sex,
    activity_level: activity,
    goal: opts.diet_goal,
  });
}
