# 牧場資料結構

## 原始資料來源
每間牧場可能來自:
- **場內管理軟體匯出**(Dairy Comp、AfiMilk、牧場自己的 Excel)
- **手寫紀錄**(需先數位化)
- **DHI 乳檢報告**(政府或酪農協會)

## 標準化後欄位(CSV 格式)

### `cows_<farm>.csv` — 牛群基本資料
```
cow_id, farm_id, ear_tag, birth_date, breed, dam_id, sire_id, status, entry_date, exit_date, exit_reason
```

### `breeding_<farm>.csv` — 繁殖事件
```
cow_id, event_date, event_type, bull_id, technician, result, result_date, notes
```
`event_type`: `heat` / `ai` / `preg_check` / `calving` / `abortion` / `dry_off`

### `milk_<farm>.csv` — DHI 乳檢
```
cow_id, test_date, days_in_milk, milk_kg, fat_pct, protein_pct, scc
```

### `health_<farm>.csv` — 疾病治療
```
cow_id, event_date, diagnosis, treatment, medication, dose, withdrawal_days, vet, notes
```

## 放置位置
- 原始:`data/farms/<farm_id>/raw/`
- 標準化:`data/farms/<farm_id>/standardized/`
- 衍生(KPI、報表):`data/reports/<farm_id>/`

## 為什麼分三層
原始保留可追溯,標準化給分析用,衍生可隨時重跑。任何一層壞掉都能從上游重建。
