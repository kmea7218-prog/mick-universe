import type { WorkoutSlot } from "../types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Filter and trim a slot list based on session duration.
//
// 30 min  → 1 主 + 2 輔 + 1 核心 (drop optional_in_30min)
// 60 min  → full template, drop add_in_90min / add_in_120min
// 90 min  → full + add_in_90min
// 120 min → full + add_in_90min + add_in_120min, but cap total slots
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function scaleSlotsToDuration(
  slots: WorkoutSlot[],
  durationMin: 30 | 60 | 90 | 120
): WorkoutSlot[] {
  let result = [...slots];

  if (durationMin === 30) {
    // drop optional + add-in-90/120; keep up to 4 slots: prefer all primaries + 1 secondary
    result = result.filter((s) => !s.optional_in_30min && !s.add_in_90min && !s.add_in_120min);
    const primaries = result.filter((s) => s.primary);
    const others = result.filter((s) => !s.primary);
    result = [...primaries, ...others.slice(0, Math.max(0, 4 - primaries.length))];
    // also reduce sets for primary by 1 to fit
    result = result.map((s) =>
      s.primary && s.default_sets > 2 ? { ...s, default_sets: s.default_sets - 1 } : s
    );
  } else if (durationMin === 60) {
    result = result.filter((s) => !s.add_in_90min && !s.add_in_120min);
  } else if (durationMin === 90) {
    result = result.filter((s) => !s.add_in_120min);
  }
  // 120 min: include everything

  // hard cap on slots to avoid overload
  const cap = ({ 30: 4, 60: 6, 90: 8, 120: 10 } as const)[durationMin];
  if (result.length > cap) result = result.slice(0, cap);

  return result;
}

// rough time estimate per slot, for showing user
export function estimateMinutesForSlot(s: WorkoutSlot): number {
  // sets × (rest + ~30s working) — convert to minutes
  const workSec = 30;
  const totalSec = s.default_sets * (workSec + s.default_rest_sec);
  return Math.round(totalSec / 60);
}

export function estimateTotalMinutes(slots: WorkoutSlot[]): number {
  // includes 5 min warm-up + sum of slots
  return 5 + slots.reduce((sum, s) => sum + estimateMinutesForSlot(s), 0);
}
