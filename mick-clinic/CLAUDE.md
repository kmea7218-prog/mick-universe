# mick-clinic — Claude 專案總指示

這個工作區是獸醫診所 / 牧場管理的資料與規則庫。

## 工作時先讀這些
- `.claude/rules/core/philosophy.md` — 核心理念與優先順序
- `.claude/rules/core/decision-making.md` — 決策原則
- 依任務類型再讀對應資料夾:前端找 `frontend/`、資料分析找 `data/`、內容產出找 `content/`...

## 子代理
複雜任務先考慮呼叫 `.claude/agents/` 裡的對應 agent(如 `vet-assistant`、`data-analyst`、`content-creator`)。

## 語言
預設用**繁體中文**回覆,程式碼與識別符用英文。

## 禁止事項
- 不要在 `data/` 下產生測試假資料(會跟真實資料混淆)
- 不要直接修改 `.claude/settings.json`,要改先問
- 不要在沒有讀規則檔的情況下產出 IG 貼文或對客戶的內容
