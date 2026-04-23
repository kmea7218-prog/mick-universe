# Workflow: 同步 Notion

## 目的
把 `data/reports/` 的月報、`content/drafts/` 的文案、客戶清單,同步到 Notion 供團隊協作。

## 方向
**單向為主**:檔案系統 → Notion。
雙向只在特定頁面(如任務看板)開啟,避免衝突。

## 步驟
1. 讀 `notion-sync/config.json`(要映射哪些檔案到哪些 Notion 資料庫)
2. 比對上次同步時間(`notion-sync/.last-sync`)
3. 對**有變動**的檔案:
   - 新增 → Notion 建 page
   - 修改 → 更新對應 page(以 filename 或 slug 對應)
   - 刪除 → 標記歸檔(不直接刪 Notion page)
4. 寫回 `.last-sync`
5. 失敗的項目寫 `notion-sync/errors.log`

## 排程
建議 GitHub Actions cron,每日一次 + 手動觸發。

## 不同步的東西
- `CLAUDE.local.md`(私人)
- `.claude/settings.local.json`
- `data/farms/*/raw/`(原始資料太雜,沒用)

## 需要的環境變數
- `NOTION_TOKEN`
- `NOTION_DB_REPORTS`, `NOTION_DB_CONTENT`, `NOTION_DB_CLIENTS`
