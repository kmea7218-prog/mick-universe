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

## 自動同步(每次對話結束前)
當一輪任務完成、且這輪對話有修改檔案時,**主動**執行:

```bash
cd /c/Users/singi/Downloads/mick-universe
git add .
git commit -m "claude: <這輪做了什麼 一句話>"
git push
```

規則:
- 只有**有實際檔案變動**時才執行(純問答、純閱讀不 commit)
- 訊息用 `claude:` 前綴,方便跟人工 / Obsidian Git 的 commit 區分
  - Obsidian Git 的前綴是 `vault:`
  - 人工 commit 不加前綴
- 若 push 失敗(沒網路、沒 remote、認證問題),不要反覆重試 — 告訴使用者並停下
- 若 `git status` 顯示衝突或非預期的檔案,**先問再 commit**,不要 blind `git add .`
- 若這是敏感內容(客戶資料、醫療紀錄、私人訊息)**先問使用者要不要 push**
