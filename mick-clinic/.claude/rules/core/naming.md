# 命名規範

## 通則
- 識別符(變數、函式、檔名)**用英文**,小寫 kebab-case 或 snake_case
- 顯示給使用者的內容(UI 字、報表標題、IG 文案)**用繁體中文**
- 資料欄位用英文 snake_case:`cow_id`, `calving_date`, `days_in_milk`

## 牛隻 ID 格式
`<farm_code>-<cow_number>`,例如 `A01-1234`
- `farm_code`:2-3 碼英數,由牧場代碼表定義
- `cow_number`:原場編號(耳標號),不補 0

## 檔名
- 報表:`report_<farm>_<yyyy-mm-dd>.{md,pdf,xlsx}`
- 原始資料:`<farm>_<資料類型>_<yyyy-mm-dd>.csv`
  - 範例:`A01_breeding_2026-04-01.csv`

## 為什麼
統一格式後,搜尋、排序、批次處理都能自動化。亂命名的代價會在做 dashboard 時爆發。
