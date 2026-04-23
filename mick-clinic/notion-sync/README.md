# notion-sync

把 `data/reports/` 與 `content/drafts/` 同步到 Notion。

## 需要的檔案
- `config.json` — 映射規則(檔案路徑 → Notion 資料庫 ID)
- `.env`(本地)或 GitHub Secrets(CI)— `NOTION_TOKEN` 等

## config.json 範例
```json
{
  "mappings": [
    {
      "source": "data/reports/**/*.md",
      "target_db": "NOTION_DB_REPORTS",
      "match_by": "filename"
    },
    {
      "source": "content/drafts/**/*.md",
      "target_db": "NOTION_DB_CONTENT",
      "match_by": "slug"
    }
  ],
  "sync_direction": "one-way"
}
```

## 執行
```bash
pnpm run sync:notion
```

(Script 尚未建立。待定:用 Notion SDK 寫 Node 腳本,或用現成工具如 `notion-cli`。)

## 詳細流程
見 `.claude/workflows/update-notion.md`。
