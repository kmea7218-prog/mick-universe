import type {
  Exercise,
  ProgressionSuggestion,
  WorkoutSetLog,
} from "./types";
import { EXERCISE_LIBRARY } from "./exercises";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Double Progression
//
// Rules (per spec):
//   - all sets hit top reps & RPE <= 8       → +2.5–5%
//   - all sets hit top reps but RPE 8–9      → hold
//   - any set below bottom rep               → -5% (or drop a set)
//   - any "疼痛不適"                          → swap exercise
//   - 連 2-3 次 "太輕鬆"                     → +1 set / +weight
//   - 連 2-3 次 "太重" / "太累"              → deload
//
// Increment %:
//   - large compound (is_compound_main):    5%
//   - small / isolation:                    2.5%
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function avg(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function roundWeight(kg: number): number {
  // 0.5 kg increments
  return Math.round(kg * 2) / 2;
}

export function suggestNextSession(
  ex: Exercise,
  setsThisSession: WorkoutSetLog[],
  recentHistoryByDate?: Record<string, WorkoutSetLog[]> // dateISO -> sets
): ProgressionSuggestion {
  if (setsThisSession.length === 0) {
    return { action: "hold", reason: "無紀錄，下次同重量" };
  }

  const targetRange = ex.default_rep_range || [8, 12];
  const [bottom, top] = targetRange;
  const lastWeight = setsThisSession[setsThisSession.length - 1].weight;
  const isLarge = !!ex.is_compound_main;
  const incPct = isLarge ? 0.05 : 0.025;

  // Pain → swap
  const anyPain = setsThisSession.some((s) => s.feeling === "疼痛不適");
  if (anyPain) {
    return {
      action: "swap",
      reason: "回報疼痛不適，建議下次替換動作；近期避免此動作。如持續請尋求專業協助。",
    };
  }

  // Streak detection (if we got recent history)
  if (recentHistoryByDate) {
    const dates = Object.keys(recentHistoryByDate).sort().slice(-3);
    const lastNFeelings = dates.flatMap((d) => recentHistoryByDate[d].map((s) => s.feeling));
    const tooEasyStreak = lastNFeelings.filter((f) => f === "太輕鬆").length;
    const tooHardStreak = lastNFeelings.filter((f) => f === "太重" || f === "疼痛不適").length;
    if (tooEasyStreak >= setsThisSession.length * 2) {
      return {
        action: "increase_weight",
        next_weight_kg: roundWeight(lastWeight * (1 + incPct)),
        pct_change: incPct,
        reason: "連續多次太輕鬆，下次加重",
      };
    }
    if (tooHardStreak >= setsThisSession.length * 2) {
      return {
        action: "deload",
        next_weight_kg: roundWeight(lastWeight * 0.85),
        pct_change: -0.15,
        reason: "連續疲勞或感覺太重，下週減量 15% / 1-2 組",
      };
    }
  }

  // Double progression
  const allHitTop = setsThisSession.every(
    (s) => s.reps >= top && s.completed
  );
  const anyMissBottom = setsThisSession.some(
    (s) => s.reps < bottom || !s.completed
  );
  const avgRpe = avg(
    setsThisSession.map((s) => s.rpe ?? (s.feeling === "太輕鬆" ? 6 : s.feeling === "剛剛好" ? 7 : s.feeling === "有點吃力" ? 8 : 9))
  );

  if (anyMissBottom) {
    return {
      action: "decrease_weight",
      next_weight_kg: roundWeight(lastWeight * 0.95),
      pct_change: -0.05,
      reason: "未達目標下限，下次降 5% 重量",
    };
  }

  if (allHitTop && avgRpe <= 8) {
    return {
      action: "increase_weight",
      next_weight_kg: roundWeight(lastWeight * (1 + incPct)),
      pct_change: incPct,
      reason: `所有組都達上限且 RPE ${avgRpe.toFixed(1)}，下次加 ${(incPct * 100).toFixed(1)}%`,
    };
  }

  if (allHitTop && avgRpe > 8) {
    return {
      action: "hold",
      reason: "達到上限但 RPE 偏高，下次先把組與動作做更穩",
    };
  }

  return { action: "hold", reason: "範圍內，下次維持" };
}

// Used to estimate starting weight for a new exercise:
// fall back to previous similar muscle history or a body-weight ratio guess.
export function estimateStartingWeight(
  ex: Exercise,
  bodyWeightKg?: number
): number | undefined {
  if (ex.equipment.includes("徒手") && !ex.equipment.includes("槓鈴") && !ex.equipment.includes("啞鈴")) {
    return undefined; // bodyweight
  }
  if (!bodyWeightKg) return undefined;
  // Very rough: small isolation = 0.1×BW per dumbbell, compound = 0.4×BW
  const ratio = ex.is_compound_main ? 0.4 : 0.1;
  return roundWeight(bodyWeightKg * ratio);
}

export function suggestionForExerciseByHistory(
  exerciseId: string,
  historyAllDates: Record<string, WorkoutSetLog[]>
): ProgressionSuggestion {
  const ex = EXERCISE_LIBRARY.find((e) => e.id === exerciseId);
  if (!ex) return { action: "hold", reason: "未知動作" };
  const dates = Object.keys(historyAllDates).sort();
  if (dates.length === 0) return { action: "hold", reason: "尚無紀錄" };
  const last = dates[dates.length - 1];
  const recentSet = dates
    .slice(-3)
    .reduce<Record<string, WorkoutSetLog[]>>((acc, d) => ({ ...acc, [d]: historyAllDates[d] }), {});
  return suggestNextSession(ex, historyAllDates[last], recentSet);
}
