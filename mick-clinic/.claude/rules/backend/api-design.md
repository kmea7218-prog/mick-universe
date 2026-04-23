# API 設計

## 基本原則
- RESTful,資源導向:`/api/farms/:farm_id/cows/:cow_id/events`
- 回傳一律 JSON,時間用 ISO 8601(`2026-04-23T09:00:00+08:00`)
- 錯誤用 HTTP status + `{ error: { code, message } }`,不要只回 200

## 權限
- 牧場主只看得到自己的牧場
- 獸醫可看自己負責的牧場清單
- 管理員全看

## 版本
URL 前綴 `/api/v1/`。破壞性變更開 v2,舊版保留至少 3 個月。

## 為什麼
牧場客戶會同時從 dashboard、手機 App、Notion 嵌入讀取。API 穩定才不會每次改都打臉。
