# data/reports

產出的報表,由 `workflows/generate-report.md` 建立。

結構:
```
<farm_id>/
├── 2026-04_monthly.md
├── 2026-04_monthly.pdf
├── 2026-W17_weekly.md
└── adhoc/
    └── 2026-04-20_reproduction-dive.md
```

## 原則
- Markdown 是真正的來源,PDF 是衍生(可重生)
- 不手改 PDF,要改就改 md 重生
- 每份報告開頭標明:資料期間、資料版本、產出日期
