# 🐄 米克宇宙 Mick Universe

> 讓生命被珍惜，讓價值不被浪費。

米克乳牛專科診所的戰情儀表板。連動 Notion + Claude AI，做成真正可操作的網站。

---

## ✨ 功能

- 📊 **儀表板首頁**：六大主軸、任務進度、完成率、2026 主戰場一覽
- 🗂️ **六大主軸**：展開可看所屬任務，可直接修改狀態/優先度並同步回 Notion
- ✅ **任務 Kanban**：三欄看板（待啟動 / 進行中 / 已完成），支援篩選、搜尋
- 💡 **腦力激盪**：記錄想法 → 請 AI 分析 → 一鍵轉成正式任務
- 🤖 **AI 協作中控**：連動 Notion 即時狀態的 Claude 對話，任何頁面都可呼叫
- 🔄 **完整 CRUD**：所有新增、編輯、刪除都同步到 Notion

---

## 🚀 快速部署（Vercel 免費方案）

### Step 1 — 準備三個金鑰

#### 1️⃣ Notion Integration Token
1. 前往 https://www.notion.so/profile/integrations
2. 點 **「New integration」**，命名為「米克宇宙」
3. 工作區選你的主要工作區 → Submit
4. 複製 **Internal Integration Token**（以 `secret_` 開頭）
5. **重要**：到你的 Notion「Notion Projects」頁面 → 右上 `···` → **「Connect to」** → 選「米克宇宙」

> 這步驟必做！否則 API 讀不到你的資料庫。

#### 2️⃣ Anthropic API Key
1. 前往 https://console.anthropic.com/settings/keys
2. 點 **「Create Key」**
3. 複製金鑰（以 `sk-ant-` 開頭）

#### 3️⃣ 已在 `.env.example` 裡填好的 Notion Data Source IDs
不用自己找，已經幫你填好了：
```
NOTION_PROJECTS_DS=b42820c4-0671-41c4-8ba3-f976d7e85799
NOTION_TASKS_DS=b3bef94a-de2c-4d1c-b84c-81ffca0ad09f
```

---

### Step 2 — 推上 GitHub

```bash
cd mick-universe
git init
git add .
git commit -m "Initial commit: 米克宇宙 v1"

# 在 github.com 建一個新 repo「mick-universe」（私有即可）
git remote add origin https://github.com/你的帳號/mick-universe.git
git branch -M main
git push -u origin main
```

---

### Step 3 — 部署到 Vercel

1. 前往 https://vercel.com/new
2. 用 GitHub 登入 → 選你剛推的 `mick-universe` repo → **Import**
3. 框架會自動偵測為 **Next.js**（不用改）
4. 展開 **Environment Variables**，依序加入：

| Key | Value |
|---|---|
| `NOTION_TOKEN` | 你的 `secret_xxx` |
| `NOTION_PROJECTS_DS` | `b42820c4-0671-41c4-8ba3-f976d7e85799` |
| `NOTION_TASKS_DS` | `b3bef94a-de2c-4d1c-b84c-81ffca0ad09f` |
| `ANTHROPIC_API_KEY` | 你的 `sk-ant-xxx` |
| `CLAUDE_MODEL` | `claude-sonnet-4-6` |

5. 點 **Deploy**
6. 等 1–2 分鐘完成 → 拿到你的網址（如 `mick-universe.vercel.app`）

---

## 🛠 本地開發

```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入真實金鑰

# 3. 啟動
npm run dev
```

開啟 http://localhost:3000

---

## 📁 專案結構

```
mick-universe/
├── app/
│   ├── layout.tsx              # 全站布局（Sidebar + AI 浮動按鈕）
│   ├── page.tsx                # 首頁儀表板
│   ├── projects/page.tsx       # 六大主軸
│   ├── tasks/page.tsx          # 任務 Kanban
│   ├── brainstorm/page.tsx     # 腦力激盪
│   ├── ai/page.tsx             # AI 全螢幕對話
│   └── api/
│       ├── notion/
│       │   ├── projects/route.ts    # Projects CRUD
│       │   └── tasks/route.ts       # Tasks CRUD
│       └── claude/
│           ├── chat/route.ts        # AI 對話
│           └── brainstorm/route.ts  # 想法分析
├── components/
│   ├── Sidebar.tsx             # 左側導覽 + 憲法角落
│   ├── AIFloater.tsx           # 右下浮動 AI 按鈕
│   ├── StatsCard.tsx           # 統計卡片（數字動畫）
│   ├── ProjectCard.tsx         # 主軸卡片
│   ├── TaskCard.tsx            # 任務卡片（可切換狀態）
│   └── AddTaskModal.tsx        # 新增任務表單
├── lib/
│   ├── notion.ts               # Notion API 封裝
│   └── claude.ts               # Claude API 封裝 + 米克憲法
└── types/
    └── index.ts                # TypeScript 型別
```

---

## 🎨 設計規格

**主色**
- `#7362FC` 主紫 · `#D862FC` 蘭紫 · `#A562FC` 中紫
- `#6283FC` 藍紫 · `#FC62E4` 洋紅 · `#BF8FFE` 淡紫

**風格**
- 白底
- 米克漸層（紫 → 紫紅）
- 柔和陰影與 gradient mesh 背景
- 圓角 2xl / 3xl 為主
- 字體：Bricolage Grotesque（標題）+ Noto Sans TC（內文）+ Noto Serif TC（憲法語錄）

---

## 🤖 AI 協作說明

AI 每次被呼叫時會自動注入：
1. 米克憲法（目的、核心理念）
2. 當前六大主軸狀態（從 Notion 即時拉）
3. 進行中的任務（最多 20 個）

AI 模型預設用 `claude-sonnet-4-6`（速度快、成本低）。
如需更強推理，改用 `claude-opus-4-7`。

---

## 📌 V2 路線圖

| 功能 | 狀態 |
|---|---|
| Google Drive 整合（讀 FARMIQ Excel） | 🔜 待規劃 |
| Notion Webhook 即時同步 | 🔜 |
| 腦力激盪永久雲端儲存（目前用 localStorage） | 🔜 |
| 每週自動生成回顧 | 🔜 |
| PWA 手機最佳化 | 🔜 |
| 多用戶登入（Google OAuth） | 🔜 |

---

## 🐛 除錯

**Q：部署後打開空白？**
A：到 Vercel → Deployment → Function Logs 查看錯誤。通常是環境變數沒設對。

**Q：AI 回應「連線錯誤」？**
A：檢查 `ANTHROPIC_API_KEY` 是否正確、是否有額度（console.anthropic.com 看）。

**Q：Notion 資料抓不到？**
A：檢查「米克宇宙」integration 有沒有連到你的 Notion Projects 頁面（Connection 設定）。

**Q：Status 欄位寫入失敗？**
A：Projects 資料庫的 Status 目前只有 Backlog/Done/Canceled。到 Notion 手動加 `In Progress` 和 `Paused` 選項。

---

Built with Next.js 14 · Tailwind · Notion API · Claude API
