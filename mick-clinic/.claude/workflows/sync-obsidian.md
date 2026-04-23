# Workflow: 同步 Obsidian

## 前提
`mick-clinic/` 本身**就是** Obsidian Vault。`.claude/` 內所有 `.md` 都在 Vault 內,Obsidian 可直接讀。

## 首次設定
1. 打開 Obsidian → `Open folder as vault` → 選 `C:\Users\singi\Downloads\mick-universe\mick-clinic`
2. 設定 → 檔案與連結:
   - 打開「偵測所有副檔名」
   - 預設連結格式:相對路徑
3. 若 `.claude/` 看不到:編輯 `.obsidian/app.json` 加上 `"showUnsupportedFiles": true`,或安裝「Show Hidden Folders」社群插件
4. 安裝 **Obsidian Git** 插件,設定:
   - Vault backup interval: 30 分鐘
   - Commit message: `sync: obsidian {{date}}`
   - 指向 `mick-universe` 的 git remote

## 日常同步
Obsidian Git 會自動:
- 定時 commit
- Pull(開啟 Vault 時)
- Push(關閉時)

若 Claude Code 也改了檔案,git 的 commit 歷史會交錯 — **這是預期行為**,不是衝突。

## 建議的 MOC 結構
在 `obsidian-vault/MOC.md` 放主要入口:
```
- [[CLAUDE]]
- Rules
  - [[philosophy]]
  - [[decision-making]]
  - ...
- Agents
- Workflows
- Reports(動態連結 data/reports)
```

## 衝突處理
兩邊同時改同一檔 → Obsidian Git 會停下要你手動解決。不要自動強制覆蓋。
