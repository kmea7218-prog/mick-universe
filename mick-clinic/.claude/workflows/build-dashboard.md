# Workflow: 建立 / 更新 Dashboard

## 觸發
- 新客戶上線,需要第一版 dashboard
- 既有 dashboard 加 KPI / 頁面

## 步驟
1. **需求確認**(strategist)
   - 目標使用者是誰?牧場主還是獸醫?
   - 首屏要看到什麼(不超過 3 個重點)
2. **資料確認**(data-analyst)
   - 需要的欄位都進 `data/farms/<farm>/standardized/` 了嗎?
   - KPI 公式在 `rules/data/kpi-definition.md` 有定義嗎?
3. **設計草稿**(dashboard-builder)
   - 先畫 wireframe(Markdown 或手繪),確認再寫 code
   - 依 `rules/frontend/design-system.md` 挑元件
4. **實作**(dashboard-builder)
   - 先拉假資料跑通,再接真資料
   - 每個 KPI 點下去要能看到定義與原始資料
5. **驗證**
   - 本地跑起來逐頁點過
   - 數字跟 `data/reports/` 對得上
6. **交付**
   - 給客戶時附帶「怎麼讀」的簡短說明

## 產出
- `dashboard/app/...` 程式碼
- `data/reports/<farm>/dashboard-spec.md` — 這個客戶看到的是哪些 KPI
