# mick-clinic

獸醫診所 / 牧場資料分類與自動化工作區。

這是一個**純檔案結構**的知識與規則庫,同時被三方讀取:
- **Claude Code**(透過 `.claude/` 的 rules / agents / workflows)
- **Obsidian**(整個 `mick-clinic/` 資料夾就是一個 Vault)
- **GitHub**(整個 `mick-universe/` 或僅此子目錄可 push)

## 目錄用途

| 路徑 | 用途 |
|---|---|
| `CLAUDE.md` | 專案對 Claude 的總指示(所有對話都會讀到) |
| `CLAUDE.local.md` | 本地私人指示,不進版控 |
| `.claude/rules/` | 分類規則 — 核心理念、前後端、資料、業務、內容 |
| `.claude/agents/` | 子代理(strategist、vet-assistant...)人格與職責 |
| `.claude/workflows/` | 多步驟工作流程(建 dashboard、同步 notion...) |
| `data/farms/` | 牧場原始資料 |
| `data/cows/` | 牛隻個體資料 |
| `data/reports/` | 產出的報表 |
| `dashboard/` | Vercel / Next.js 儀表板 |
| `notion-sync/` | Notion 同步腳本與設定 |
| `obsidian-vault/` | Obsidian 專用的筆記(日記、模板、MOC) |

## 同步方式

### 1. Obsidian 同步
整個 `mick-clinic/` 就是一個 Vault。

**開啟方式**:Obsidian → `Open folder as vault` → 選 `mick-clinic/`。

若 Obsidian 預設隱藏 `.claude/` 資料夾,去 `設定 → 檔案與連結 → 偵測所有副檔名` 打開,或在 `.obsidian/app.json` 加 `"showUnsupportedFiles": true`。

版本同步建議用 **Obsidian Git 插件**,指向 `mick-universe` 的 git repo。

### 2. GitHub 同步
`mick-clinic/` 是 `mick-universe/` 的子目錄,所以跟著外層 repo 一起 push。

首次設定:
```bash
cd /c/Users/singi/Downloads/mick-universe
git init
git add .
git commit -m "init: mick-clinic structure"
git remote add origin <your-github-url>
git push -u origin main
```

### 3. Claude Code
在此目錄開 Claude Code 即可,`.claude/` 會自動載入。
