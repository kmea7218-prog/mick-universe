import type { WorkoutTemplate } from "../types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Workout templates by frequency.
// Time scaling (30/60/90/120 min) is handled by time-scaler.ts.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TEMPLATES: WorkoutTemplate[] = [
  // ═══ 每週 2 練：全身 A / B ═══
  {
    id: "fb-2x-A",
    name: "全身 A · 蹲 + 推 + 拉",
    weekly_sessions: 2,
    day_index: 1,
    description: "下肢蹲類為主，配胸推與背拉",
    slots: [
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "肩部孤立", required_categories: ["肩膀"], primary: false, default_sets: 2, default_rep_range: [12, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
      { focus: "心肺收尾", required_patterns: ["心肺體能"], primary: false, default_sets: 1, default_rep_range: "time", default_rest_sec: 0, add_in_120min: true },
    ],
  },
  {
    id: "fb-2x-B",
    name: "全身 B · 髖鉸鏈 + 拉 + 推",
    weekly_sessions: 2,
    day_index: 2,
    description: "髖鉸鏈為主，配背划船與肩或胸推",
    slots: [
      { focus: "髖鉸鏈", required_patterns: ["髖鉸鏈"], primary: true, default_sets: 3, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "背部垂直拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "肩推", required_categories: ["肩膀"], required_patterns: ["推"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "二頭", required_categories: ["手臂"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
      { focus: "三頭", required_categories: ["手臂"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },

  // ═══ 每週 3 練：恢復習慣用 全身 A/B/C；中階以上可換 PPL ═══
  {
    id: "fb-3x-A",
    name: "全身 A · 蹲 + 推",
    weekly_sessions: 3,
    day_index: 1,
    description: "下肢主動作 + 上半身推",
    slots: [
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "肩推", required_categories: ["肩膀"], required_patterns: ["推"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "三頭", required_categories: ["手臂"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },
  {
    id: "fb-3x-B",
    name: "全身 B · 髖鉸鏈 + 拉",
    weekly_sessions: 3,
    day_index: 2,
    description: "髖鉸鏈主動作 + 上半身拉",
    slots: [
      { focus: "髖鉸鏈", required_patterns: ["髖鉸鏈"], primary: true, default_sets: 3, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "背部垂直拉", required_categories: ["背部"], required_patterns: ["拉"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "二頭", required_categories: ["手臂"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },
  {
    id: "fb-3x-C",
    name: "全身 C · 腿後/臀 + 上身均衡",
    weekly_sessions: 3,
    day_index: 3,
    description: "臀腿後 + 上身肩肩補強",
    slots: [
      { focus: "腿後/臀", required_categories: ["大腿下肢"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: false, default_sets: 2, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "肩部孤立", required_categories: ["肩膀"], primary: false, default_sets: 2, default_rep_range: [12, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },

  // ═══ 每週 4 練：上 / 下 / 上 / 下 ═══
  {
    id: "ul-4x-U1",
    name: "上半身 1 · 推為主",
    weekly_sessions: 4,
    day_index: 1,
    description: "胸 + 肩 + 三頭",
    slots: [
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: true, default_sets: 4, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "肩推", required_categories: ["肩膀"], required_patterns: ["推"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "肩部孤立", required_categories: ["肩膀"], primary: false, default_sets: 3, default_rep_range: [12, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "三頭", required_categories: ["手臂"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, add_in_90min: true },
    ],
  },
  {
    id: "ul-4x-L1",
    name: "下半身 1 · 蹲為主",
    weekly_sessions: 4,
    day_index: 2,
    description: "蹲 + 髖鉸鏈 + 股四頭孤立",
    slots: [
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: true, default_sets: 4, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "髖鉸鏈", required_patterns: ["髖鉸鏈"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "腿後/臀", required_categories: ["大腿下肢"], primary: false, default_sets: 3, default_rep_range: [10, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },
  {
    id: "ul-4x-U2",
    name: "上半身 2 · 拉為主",
    weekly_sessions: 4,
    day_index: 3,
    description: "背 + 後三角 + 二頭",
    slots: [
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 4, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "背部垂直拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "肩部孤立", required_categories: ["肩膀"], primary: false, default_sets: 3, default_rep_range: [12, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "二頭", required_categories: ["手臂"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, add_in_90min: true },
    ],
  },
  {
    id: "ul-4x-L2",
    name: "下半身 2 · 髖為主",
    weekly_sessions: 4,
    day_index: 4,
    description: "硬舉 + 臀推 + 腿後/臀",
    slots: [
      { focus: "髖鉸鏈", required_patterns: ["髖鉸鏈"], primary: true, default_sets: 4, default_rep_range: [5, 8], default_rest_sec: 180 },
      { focus: "腿後/臀", required_categories: ["大腿下肢"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "腿後/臀", required_categories: ["大腿下肢"], primary: false, default_sets: 3, default_rep_range: [10, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },

  // ═══ 每週 5-6 練：PPL 循環（5 = PPL+UL，6 = PPLPPL） ═══
  {
    id: "ppl-Push",
    name: "Push · 胸 + 肩 + 三頭",
    weekly_sessions: 5,
    day_index: 1,
    description: "推日：胸 + 肩 + 三頭",
    slots: [
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: true, default_sets: 4, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "肩推", required_categories: ["肩膀"], required_patterns: ["推"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "胸推", required_categories: ["胸部"], required_patterns: ["推"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "肩部孤立", required_categories: ["肩膀"], primary: false, default_sets: 3, default_rep_range: [12, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "三頭", required_categories: ["手臂"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
    ],
  },
  {
    id: "ppl-Pull",
    name: "Pull · 背 + 後三角 + 二頭",
    weekly_sessions: 5,
    day_index: 2,
    description: "拉日：背 + 後三角 + 二頭",
    slots: [
      { focus: "背部垂直拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 4, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "背部水平拉", required_categories: ["背部"], required_patterns: ["拉"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "肩部孤立", required_categories: ["肩膀"], primary: false, default_sets: 3, default_rep_range: [12, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "二頭", required_categories: ["手臂"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 60, optional_in_30min: true },
    ],
  },
  {
    id: "ppl-Legs",
    name: "Legs · 蹲 + 髖 + 腿後/臀",
    weekly_sessions: 5,
    day_index: 3,
    description: "腿日：蹲 + 髖 + 腿後/臀",
    slots: [
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: true, default_sets: 4, default_rep_range: [6, 10], default_rest_sec: 150 },
      { focus: "髖鉸鏈", required_patterns: ["髖鉸鏈"], primary: true, default_sets: 3, default_rep_range: [8, 12], default_rest_sec: 120 },
      { focus: "下肢推/蹲", required_patterns: ["蹲"], primary: false, default_sets: 3, default_rep_range: [10, 12], default_rest_sec: 90 },
      { focus: "腿後/臀", required_categories: ["大腿下肢"], primary: false, default_sets: 3, default_rep_range: [10, 15], default_rest_sec: 60, optional_in_30min: true },
      { focus: "核心", required_categories: ["腹部核心"], primary: false, default_sets: 2, default_rep_range: "time", default_rest_sec: 45, optional_in_30min: true },
    ],
  },
];

export function getWeeklyPlan(weeklySessions: 2 | 3 | 4 | 5 | 6): WorkoutTemplate[] {
  if (weeklySessions === 2) return TEMPLATES.filter((t) => t.weekly_sessions === 2);
  if (weeklySessions === 3) return TEMPLATES.filter((t) => t.weekly_sessions === 3);
  if (weeklySessions === 4) return TEMPLATES.filter((t) => t.weekly_sessions === 4);
  // 5x = PPL + 2 weakpoint upper/lower (use UL templates)
  // 6x = PPL twice
  if (weeklySessions === 5) {
    return [
      ...TEMPLATES.filter((t) => t.weekly_sessions === 5),
      ...TEMPLATES.filter((t) => t.id === "ul-4x-U1" || t.id === "ul-4x-L1"),
    ];
  }
  if (weeklySessions === 6) {
    return [
      ...TEMPLATES.filter((t) => t.weekly_sessions === 5),
      ...TEMPLATES.filter((t) => t.weekly_sessions === 5),
    ];
  }
  return [];
}
