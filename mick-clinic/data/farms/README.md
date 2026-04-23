# data/farms

每個牧場一個子資料夾,例如 `A01/`、`B02/`。

結構:
```
<farm_id>/
├── raw/            # 原始匯出 (保留不動)
│   └── 2026-04_breeding.xlsx
├── standardized/   # 依 rules/data/farm-data-structure.md 清洗後的 CSV
│   ├── cows.csv
│   ├── breeding.csv
│   ├── milk.csv
│   └── health.csv
└── meta.yaml       # 牧場基本資料:規模、品種、聯絡人
```

原始檔預設**不進 git**(隱私 + 檔案大),見 `.gitignore`。
