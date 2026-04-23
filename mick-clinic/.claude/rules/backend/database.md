# 資料庫設計

## 技術選擇(暫定)
- 開發期:SQLite / Postgres (via Supabase)
- 正式:Postgres

## 核心表(初稿)
- `farms` — 牧場
- `cows` — 牛隻個體(主鍵 `cow_id`,外鍵 `farm_id`)
- `breeding_events` — 配種、懷孕確認、分娩
- `health_events` — 疾病、治療、疫苗
- `milk_records` — 每月 DHI 資料
- `users` — 牧場主、獸醫、管理員

## 設計原則
- 所有事件表都有 `event_date`, `recorded_at`, `recorded_by`
- **不做軟刪除邏輯 flag**,改用 `deleted_at` 欄位;查詢預設排除
- 外鍵一定建,不允許孤兒資料
- 錢、重量、奶量等數值不用 float,用 `decimal` 或整數加小數位

## 為什麼 decimal
float 會讓奶量 30.1 變 30.099999,客戶看到會不信任。
