# 自動化規則

## 可以自動化的
- 每日拉取牧場資料、計算 KPI、更新 dashboard
- Notion 資料庫同步(雙向或單向,見 `workflows/update-notion.md`)
- Obsidian Vault 同步(見 `workflows/sync-obsidian.md`)
- 月報 / 週報產出
- 異常偵測通知(如乳量連續下降、繁殖率異常)

## 不可以自動化的
- 發送給客戶的訊息(必須人工確認)
- 資料刪除
- 定價、服務方案調整
- 治療建議(只能列警示,不做決策)

## 排程
建議用 GitHub Actions(cron)或 Vercel Cron。設定放 `.github/workflows/` 或 `vercel.json`。

## 為什麼
自動化的省時好處會被「一次自動發錯訊息」全數抵消。決策性操作保留人工關卡。
