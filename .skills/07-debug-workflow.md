---
name: debug-workflow
description: Use when debugging an error, broken flow, failing API, UI regression, or data mismatch in this repo.
type: technique
---

# 07 Debug Workflow

## 7 buoc
1. Doc loi.
2. Xac dinh pham vi FE / BE / DB / config.
3. Tim file lien quan.
4. Trace luong du lieu end-to-end.
5. Tim root cause.
6. De xuat fix nho nhat.
7. Test lai.

## Khi dung MCP nao
- filesystem: tim file, doc code, trace luong
- git: xem diff / log / status
- mysql: doi chieu data that
- playwright: xem UI crash / route / network / console
- context7: neu nghi do thu vien / API / syntax
- fetch: doc tai lieu ngoai repo

## Cach debug dung
- Bat dau tu symptom thuc.
- Khong sua khi chua tim duong di cua data.
- Khong doan root cause tu nhin 1 file.
- Doc ca route, service, DTO, helper, schema neu can.

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

## Format bao cao debug
- Loi gi
- O dau
- Root cause
- Fix nho nhat
- Test lai
- Con rui ro gi khong

## Checklist sau khi fix
1. Root cause da xac nhan
2. Fix nho nhat
3. Test da chay
4. Da quet debug leftovers
5. Khong con console.log/debugger tam
6. Khong doi response shape ngoai y muon

## Cach tranh sua nham nghiep vu
- Giu nguyen contract neu chua chac.
- Giu nguyen status flow neu co the.
- Sua file it nhat.
- Neu data/DB la goc, xac minh bang SELECT truoc.

## Neu chua du du lieu
- Noi ro phan thieu gi.
- Xin them file / log / screenshot / query.
- Khong tu nhay sang ket luan lon.
