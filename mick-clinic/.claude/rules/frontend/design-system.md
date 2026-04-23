# 設計系統

## 色票(暫定,待確認)
- Primary: 牧場綠 `#4A7C59`
- Accent: 乳白 `#F5F1E8`
- Warning: 琥珀 `#E8A33D`
- Danger: 深紅 `#B84444`
- Text: `#2B2B2B` / Muted `#6B6B6B`

## 字體
- 中文:Noto Sans TC
- 數字:SF Mono / JetBrains Mono(強調等寬對齊)

## 間距
8px 基準:`4 / 8 / 16 / 24 / 32 / 48`。

## 元件清單(待建)
- KPICard:大數字 + 單位 + 同期比較
- CowList:牛隻清單,支援篩選與標籤
- EventTimeline:繁殖 / 治療 / 產乳事件軸

## 原則
元件寫在 `dashboard/components/`,一個元件一個檔,對應 `.stories.tsx` 或文件範例。
