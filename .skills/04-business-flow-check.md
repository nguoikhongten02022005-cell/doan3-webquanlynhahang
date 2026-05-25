---
name: business-flow-check
description: Use when checking end-to-end customer or internal restaurant workflows against the real repo behavior.
type: technique
---

# 04 Business Flow Check

## Luong can check
- Khach hang tu dau den cuoi
- Admin / noi bo tu dau den cuoi
- Dat mon / goi mon tai ban
- Dat ban
- Thanh toan
- Ma giam gia
- Dashboard / thong ke
- Quan ly nguoi dung / role

## Cach check
- Bat dau tu page FE.
- Trace service API.
- Xac minh controller + service BE.
- Doi chieu DB schema + seed.
- Xem trang thai co di dung qua tung buoc khong.

## Tieu chi phan loai
- **Thieu nghiem trong:** flow bi dut, sai trang thai, sai contract, sai DB, khong demo duoc.
- **Nen bo sung:** flow chay duoc nhung thieu chi tiet quan trong.
- **Co nhung can cai thien:** chay duoc, nhung co goc canh bao / edge case / UX nho.
- **Du de bao cao/nop:** flow chay end-to-end, khong vo contract chinh.

## Gia tri can soi
- Dat ban: trang thai booking -> assign ban -> check-in -> completed/cancel.
- Don hang: pending -> preparing -> ready -> served -> paid/cancel.
- Thanh toan: pending -> success/failed/refunded.
- Ma giam gia: active/inactive/expired, min order, max discount, usage cap.
- Danh gia: chi cho don hop le, review status ro rang.

## Cach ket luan
- Noi ro flow nao OK
- Noi ro flow nao dut
- Noi ro noi phai sua
- Noi ro co demo duoc khong
