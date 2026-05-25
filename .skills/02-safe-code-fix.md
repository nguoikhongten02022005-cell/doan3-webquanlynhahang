---
name: safe-code-fix
description: Use when fixing code in this repo and needing minimal, low-risk changes without breaking FE-BE contract or business flow.
type: technique
---

# 02 Safe Code Fix

## Rule goc
- Luon doc `00-project-context` truoc.
- Luon tim root cause truoc.
- Chi sua file can thiet.
- Khong refactor lon.
- Khong doi nghiep vu dang chay dung.

## Khong duoc lam
- Khong doi response shape neu FE dang dung.
- Khong doi ten field API neu chua chac.
- Khong thay DTO/validation mo rong vo can.
- Khong doi DB schema neu khong duoc yeu cau.
- Khong format lai file code vo ly do.

## Checklist truoc khi sua
- Xac dinh loi o FE / BE / DB / config.
- Trace tu UI -> service -> controller -> service -> DB.
- Tim file tao ra du lieu / response.
- Xac nhan contract hien tai.
- Xac dinh pham vi nho nhat.

## Cach sua
- Sua dung cho doi voi root cause.
- Neu 1 field/shape da duoc FE dung, giu nguyen.
- Neu can thay doi, phai check tat ca noi dung field do.
- Neu co nghiep vu status, giu dung trang thai hien co.

## Sau khi sua phai bao cao
- File da sua
- Root cause
- Cach sua
- Anh huong FE / BE / DB
- Test da chay hoac can chay
- Da kiem tra debug leftovers chua
- Con console/debugger tam khong
- Git diff con file nao

## Debug cleanup rule
- Trong luc debug co the them log tam neu that su can.
- Log/debug tam phai co comment ro `TEMP DEBUG` neu them.
- Truoc khi ket thuc task, bat buoc quet lai diff.
- Phai xoa toan bo:
  + console.log tam
  + debugger
  + comment debug tam
  + file test nhap
  + SQL thu khong can thiet
  + doan code chi dung de kiem tra
- Khong xoa log/error handling chinh thuc cua he thong.
- Khong xoa log co chu dich neu user yeu cau giu.
- Sau khi fix xong phai bao:
  + Da kiem tra debug leftovers chua
  + Co con console/debugger tam khong
  + Git diff con nhung file nao

## Checklist sau khi sua
- Contract khong vo
- Status flow khong vo
- Khong tang scope
- Khong co thay doi khong can thiet
- Test / build / lint phu hop da chay
1. Root cause da xac nhan
2. Fix nho nhat
3. Test da chay
4. Da quet debug leftovers
5. Khong con console.log/debugger tam
6. Khong doi response shape ngoai y muon
