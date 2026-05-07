# Restart Fit · Engine（v2 更新摘要）

陪伴型 AI 健身 App 的核心邏輯層 — 動作庫、AI 排課、進階建議、營養計算。
與 UI 完全分離，UI 透過 `/api/restart-fit/*` 取資料。

---

## 一、新增了什麼

| 區塊 | 內容 | 檔案 |
|---|---|---|
| **動作資料庫** | 7 大類、~50 parent + 變化 200+，含 `name_zh`、肌群、器材、`muscle_emphasis_note`、`ai_programming_note`、技術/疲勞分級、預設 rep range | [`exercises/`](./exercises) |
| **AI 排課** | Template + Slot Filler + Time Scaler；2/3/4/5/6 練週 × 30/60/90/120 分鐘 | [`programming/`](./programming) |
| **訓練紀錄 + 漸進超負荷** | 雙進展規則、疼痛 → 替換、太累 → deload、太輕鬆 → 加重 | [`progression.ts`](./progression.ts) |
| **體重 / 卡路里** | Mifflin-St Jeor BMR、活動倍率 TDEE、減脂/維持/增肌目標、巨量分配 | [`nutrition.ts`](./nutrition.ts) |
| **AI 對話調整課表** | 自然語意分類 + 確定性規則調整 + Claude 寫陪伴語氣說明 | [`/api/restart-fit/adjust`](../../app/api/restart-fit/adjust/route.ts) |
| **動作庫 API** | 依 category / pattern / equip / 關鍵字搜尋 | [`/api/restart-fit/exercises`](../../app/api/restart-fit/exercises/route.ts) |

---

## 二、檔案地圖

```
lib/restart-fit/
├── types.ts                # 全部 TS 型別 — Exercise / WorkoutSetLog / NutritionTargets...
├── exercises/
│   ├── arms.ts             # 二頭 + 三頭
│   ├── shoulders.ts        # 肩推 / 側平舉 / 前平舉 / 後三角
│   ├── chest.ts            # 推舉 / 飛鳥 / 徒手胸
│   ├── core.ts             # 腹直肌 / 側核心 / 抗伸展
│   ├── legs.ts             # 蹲 / 髖鉸鏈 / 腿後 / 臀 / 內外展
│   ├── back.ts             # 垂直拉 / 水平拉 / 後三角 / 下背 / 感受度
│   ├── full-body.ts        # 全身性 + 心肺
│   └── index.ts            # 集中出口 + helpers (getExercise, exerciseDisplayName)
├── programming/
│   ├── templates.ts        # WorkoutTemplate × 13（FB/UL/PPL）
│   ├── slot-filler.ts      # 為 slot 從動作庫挑最適合的動作
│   ├── time-scaler.ts      # 30/60/90/120 min 增減 slots
│   └── index.ts            # generateWorkoutFromTemplate + generateForDay
├── progression.ts          # suggestNextSession（雙進展）
├── nutrition.ts            # computeBMR / computeNutrition / nutritionFromPreference
└── README.md               # ← 你正在讀這個

app/api/restart-fit/
├── coach/route.ts          # 一般陪伴對話（Claude）
├── plan/route.ts           # POST → 產生今日 GeneratedWorkout + weekly_plan + nutrition
├── log-set/route.ts        # POST → 回傳 ProgressionSuggestion
├── adjust/route.ts         # POST → 自然語意調整 workout + Claude 寫 reasoning
└── exercises/route.ts      # GET 動作庫，支援 ?category=&pattern=&equip=&q=
```

---

## 三、後續怎麼新增動作

1. 找對應分類檔（例：手臂 → `exercises/arms.ts`）
2. 在陣列尾端加新的 `Exercise`：
   ```ts
   {
     id: "spider-curl",                    // kebab-case，永久不可改
     name_zh: "蜘蛛彎舉",
     name_en: "Spider Curl",
     category: "手臂",
     movement_pattern: "孤立訓練",
     equipment: ["啞鈴", "斜板"],
     primary_muscles: ["二頭肌"],
     secondary_muscles: [],
     muscle_emphasis_note: "趴在斜板上做彎舉，二頭收縮張力最大。",
     suitable_for: "中階",
     fatigue_level: "中",
     skill_level: "中",
     ai_programming_note: "二頭日中段，收縮感受度首選。",
     default_rep_range: [10, 12],
   }
   ```
3. 變化用 `variations` 子陣列（不要把每個變化拆成獨立 Exercise）
4. 不需動其他檔。`exercises/index.ts` 已經把所有檔合併

> **建議分類檔超過 200 行就再切**（例如 `legs.ts` → `legs-squat.ts` + `legs-hinge.ts`），記得在 `exercises/index.ts` 把新檔 import 進來。

---

## 四、後續怎麼調整排課規則

| 想改什麼 | 改哪 |
|---|---|
| 主動作組數、休息秒數 | `programming/templates.ts` 對應的 `WorkoutTemplate.slots` |
| 哪個 slot 在 30/90/120 分鐘要進/退 | slot 上的 `optional_in_30min` / `add_in_90min` / `add_in_120min` |
| AI 挑動作的偏好（恢復習慣優先機械） | `programming/slot-filler.ts` 的 `score()` 函式 |
| 30/60/90/120 分鐘的時間規則 | `programming/time-scaler.ts` 的 `scaleSlotsToDuration` |
| 各目標的次數區間（減脂、力量提升…） | `programming/index.ts` 的 `repsForGoal` / `setsForGoal` |
| 各目標的預設 RPE | 同上的 `rpeForGoal` |
| 雙進展的加重百分比 | `progression.ts` 的 `incPct`（compound 5% / iso 2.5%） |
| BMR / TDEE / 巨量分配 | `nutrition.ts` |
| 自然語意如何分類使用者反饋 | `app/api/restart-fit/adjust/route.ts` 的 `classifyFeedback` |
| AI 對話的陪伴語氣（system prompt） | `app/api/restart-fit/coach/route.ts` 的 `COACH_SYSTEM` |

---

## 五、API 介面（給前端 fetch）

### `GET /api/restart-fit/exercises`
Query：`category`、`pattern`、`equip`、`q`
回：`{ count, items: Exercise[] }`

### `POST /api/restart-fit/plan`
Body：
```json
{
  "user": { "goal": "恢復運動習慣", "weekly_sessions": 3, "session_duration_minutes": 60, "experience_level": "新手", "preferred_time_slot": "不固定", "available_equipment": ["徒手","啞鈴"], "body_weight_kg": 78, "diet_goal": "減脂" },
  "day_index": 1,
  "body": { "height_cm": 172, "age": 32, "sex": "male" }
}
```
回：`{ workout: GeneratedWorkout, weekly_plan: [...], nutrition: NutritionTargets | null }`

### `POST /api/restart-fit/log-set`
Body：`{ exercise_id, sets_this_session: WorkoutSetLog[], recent_history? }`
回：`{ exercise, suggestion: ProgressionSuggestion }`
- `suggestion.action`：`increase_weight | hold | decrease_weight | swap | deload`
- 若 `feeling: "疼痛不適"` 直接 `swap`
- 連 2-3 次太輕鬆 → `increase_weight`
- 連 2-3 次太累 → `deload`

### `POST /api/restart-fit/adjust`
Body：`{ workout?, user, feedback: string, day_index? }`
- 自然語意分類為：時間不足 / 疼痛不適 / 疲勞 / 想加強某部位 / 想替換動作 / 器材限制 / 其他
- 套用確定性規則修改 workout（不讓 AI 重生整個課表，避免不可預測）
- Claude 只負責 1-3 句陪伴語氣的 `ai_reasoning_summary`
回：`{ original_workout_id, adjustment_type, adjusted: GeneratedWorkout, diff }`

### `POST /api/restart-fit/coach`
一般陪伴對話（Claude）。Body：`{ messages: ChatMsg[], context? }`，回：`{ reply }`。

---

## 六、設計取捨

1. **AI 不直接生成完整課表** — 太不可預測。我們用「Template + Slot Filler」確定性產生，AI 只寫 reasoning 和分類意圖。安全、可測、好維護。
2. **動作用 parent + variations** — 槓鈴彎舉 4 種握法、Pull-Up 9 種變化都掛在同一個 parent。新手看清楚、AI 排課簡化、未來擴充不爆炸。
3. **訓練紀錄目前無持久化**（in-memory + localStorage）— Supabase 接入時會把 `WorkoutSetLog` 直接 insert 進對應 schema（types 已備好）。
4. **預設偏向「恢復運動習慣」** — slot-filler 對機械、徒手、低技術門檻動作給負分；新手強度 RPE 6.5、不力竭。
5. **進度安全第一** — 任何 `feeling: "疼痛不適"` 直接觸發替換動作建議，並在 UI 上紅字提示。

---

## 七、目前還沒做（但 type 已定義好）

- `DailyCheckIn`（睡眠 / 能量 / 痠痛 / 壓力 / 動力 1-5）→ types.ts 有，UI 還沒做
- `ManualWorkoutEditLog` → types.ts 有，目前手動換動作還沒寫紀錄
- 真的把 5x/6x 練做完整 PPL 循環（目前用 5 = PPL+UL，6 = PPL×2 簡化）
- 增加更多冷門動作（例如 Pendlay Row 變化、單腿硬舉…）
- Supabase 持久化（schema 已在 types.ts，可直接 mapping）
