# dashboard

Next.js / Vercel 儀表板。

目前外層 `mick-universe/` 已經有 Next.js 專案。兩種做法:

**A. 沿用外層專案**(推薦)
- 直接在 `mick-universe/app/` 下加路由 `app/clinic/...`
- 這個資料夾只放**診所專用的元件**,之後 import 進外層頁面

**B. 獨立新專案**
- 在這裡重新 `pnpm create next-app`
- Vercel 上分開部署

## 規則
- UI 規則見 `.claude/rules/frontend/dashboard-ui.md`
- 設計系統見 `.claude/rules/frontend/design-system.md`
- KPI 計算不要在前端做,走 API(見 `.claude/rules/backend/api-design.md`)
