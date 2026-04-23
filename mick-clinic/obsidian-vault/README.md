# obsidian-vault

Obsidian 專用的輔助內容(不給 Claude 當規則讀,只是人用的筆記)。

## 放什麼
- `MOC.md` — 主目錄頁(Map of Content),串起整個 Vault 的入口
- `templates/` — 日記、個案、會議筆記模板
- `daily/` — 每日筆記
- `people/` — 客戶、合作夥伴檔案(敏感 → 進 `.gitignore`)

## Vault 根目錄
**整個 `mick-clinic/` 就是 Vault 根**,不只有這個子資料夾。這樣 Obsidian 才能看到 `.claude/rules/`、`data/` 等內容。

## 不放什麼
- 規則、agents、workflows(那些是 Claude 的來源,放 `.claude/`)
- 原始資料(放 `data/`)

## 同步
見 `.claude/workflows/sync-obsidian.md`。
