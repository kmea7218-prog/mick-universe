# 🇸🇬 YuxChuxMick · 獅城報復性五日遊

> 八月熱帶爽吃爽玩 · 2026.08 · Chu Yu × 另一位家長 × Mick（5 歲）

一個單檔 HTML 的互動式親子旅遊規劃網頁，含：

- 📍 景點、🍜 美食、🗺 五日詳細行程（附照片）
- ✈ KHH → SIN 星宇 / 長榮參考價 + Skyscanner、Trip.com、Google Flights、Kayak 一鍵跳轉
- 💱 每日 0:00 自動更新 TWD ↔ SGD 匯率（ECB Frankfurter API）+ 換匯計算機
- 💬 直接跟 Claude 聊這趟旅程（需自備 Anthropic API Key）
- 📱 手機 APP 分頁式結構，預留未來分頁（🏨 住宿 / 🚇 交通 / 📷 相簿）

---

## 🚀 最快開始

1. 下載這個資料夾
2. 雙擊 `index.html`

網頁在瀏覽器打開即可使用所有功能，除了 Claude 聊天需要貼上 Anthropic API Key。

---

## 🔑 要跟 Claude 聊天

1. 前往 <https://console.anthropic.com/settings/keys>
2. 點「Create Key」→ 複製（以 `sk-ant-` 開頭）
3. 打開網頁 → 底部 tab bar 點「💬 Claude」
4. 貼上 Key → 儲存
5. 開始聊

Key 只存你瀏覽器的 `localStorage`，不會上傳任何地方。

---

## ☁ 部署到網路（免費）

### 方法 A：Vercel（最簡單 · 自動 HTTPS）

```bash
# 1. 下載 Vercel CLI（只做一次）
npm i -g vercel

# 2. 在這個資料夾裡
cd yuchumick-singapore
vercel
```

依指示登入、建立專案、選 Production，1 分鐘就部署好，拿到 `xxx.vercel.app` 網址。

或用網頁：把這個資料夾推到 GitHub repo → 到 <https://vercel.com/new> Import → Deploy。

### 方法 B：GitHub Pages

```bash
cd yuchumick-singapore
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/yuchumick-singapore.git
git push -u origin main
```

然後到 repo Settings → Pages → Source 選 `main` 分支、`/ (root)` 資料夾 → Save。

幾分鐘後：`https://你的帳號.github.io/yuchumick-singapore/`。

### 方法 C：Cloudflare Pages / Netlify

把資料夾 drag & drop 到 <https://pages.cloudflare.com> 或 <https://app.netlify.com/drop> 即可。

---

## 📁 檔案結構

```
yuchumick-singapore/
├── index.html       # 整個網頁（HTML + CSS + JS 全部在這）
├── vercel.json      # Vercel 靜態部署設定
├── .gitignore
└── README.md
```

全部邏輯都在單一 HTML 檔內，**不需要 build、不需要 npm install**。

---

## 🌐 用到的外部服務

| 服務 | 用途 | 需要 Key |
|---|---|---|
| Tailwind CDN | CSS 樣式 | ❌ |
| Google Fonts | 字型（Bricolage / Noto Sans TC） | ❌ |
| Unsplash Source | 景點、美食照片 | ❌ |
| Frankfurter API (ECB) | SGD ↔ TWD 匯率 | ❌ |
| Anthropic API | Claude 對話 | ✅ 使用者自備 |
| Skyscanner / Trip.com / Google Flights / Kayak | 機票比價跳轉 | ❌ |

---

## 🛠 本地修改

想改景點、餐廳、預算、日期？直接編輯 `index.html`：

- 標題 / 日期區塊：搜尋「八月熱帶爽吃爽玩」
- 五日行程：搜尋 `<!-- Day 1 -->`、`<!-- Day 2 -->`、…
- 機票參考價：搜尋 `18,000` 或 `17,000`
- 美食清單：搜尋 `<!-- 海南雞飯 -->`
- 聊天 system prompt：搜尋 `function buildSystem()`

---

## 🎨 設計色票

- 🔴 `#EF4444` 主紅（象徵新加坡國旗紅）
- 🟠 `#FF7A6B` 珊瑚橘
- 🟡 `#FFB547` 熱帶陽光黃
- 🟢 `#4FD1C5` 青瓷綠（濱海灣海水）
- 🔵 `#0D4B7A` 深海藍（文字主色）
- 🟦 `#7EC9F7` 天空藍
- 🤎 `#FFF7ED` 奶油米白

---

## 📜 授權

個人專案，非商業使用。景點資訊與照片為示意，實際價格、時刻、開放狀態以官方網站為準。

---

Built with ❤ for Chu Yu × Mick · 2026.04
