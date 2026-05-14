---
name: code-review
description: Use when reviewing code changes in this repo for bugs, contract drift, business logic mistakes, auth issues, or DB mapping issues.
type: technique
---

# 03 Code Review

## Pham vi review
- Frontend
- Backend
- DTO / validation
- Service logic
- DB mapping
- Auth / role / permission
- Status nghiep vu
- Dashboard / thong ke
- Response shape / error shape
- Race condition / double submit

## Cach review
- Doc context truoc.
- Doc diff + file lien quan.
- Trace API / state / DB.
- Check FE-BE khop method/path/body/query/params.
- Check status flow co hop logic khong.
- Check data mapping co mat field / sai ten / sai kieu khong.

## Dac biet can soi
- Auth guard / role guard
- Pagination / filter / sort
- Date / timezone
- Decimal / money / rounding
- Dashboard KPI / view SQL
- Response shape thay doi
- Lich su / history / audit trail

## Format bao cao bat buoc
- Ket luan
- Blocker
- Can sua
- Optional cleanup
- Safe to submit: Yes/No

## Neu khong chac
- Nêu rang khong du du lieu
- Yeu cau doc file lien quan
- Khong doan
