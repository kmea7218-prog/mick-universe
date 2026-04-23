# .claude — Claude Code 設定與規則入口

這個資料夾集中所有給 Claude 的**指示、規則、子代理、工作流**。

## 載入順序
1. `CLAUDE.md`(外層專案總指示)
2. `.claude/rules/core/*` — 核心原則,每次都讀
3. `.claude/rules/<領域>/*` — 依任務類型讀
4. `.claude/agents/*` — 被 Agent 工具呼叫時載入
5. `.claude/workflows/*` — 被觸發時載入

## 修改原則
- 規則檔寫「**為什麼**」而不只是「要做什麼」,未來才能判斷邊界情況。
- 新增規則先檢查有沒有已存在的可更新,避免重複。
- `settings.json` 是共用版本,`settings.local.json` 是本機覆寫(不進版控)。
