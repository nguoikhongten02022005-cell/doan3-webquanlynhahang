---
name: api-fe-be-matching
description: Use when checking whether frontend service calls match backend routes, payloads, status codes, and response shapes in this repo.
type: technique
---

# 05 API FE-BE Matching

## Cach tim FE service
- tim trong `frontend/src/services/`
- tim hook / context goi service
- tim page / feature dung du lieu

## Cach tim BE route
- tim controller trong `backend/nest-api/src/modules/*/*.controller.ts`
- tim module + service + DTO lien quan
- doi chieu prefix `/api`

## Can kiem tra
- method
- path
- body
- query
- params
- response shape
- error shape
- status code
- auth header / role guard

## Phat hien lech FE-BE
- field FE doc khac ten BE tra ve
- FE gui body thieu field bat buoc
- FE goi sai method/path
- BE doi response shape lam FE crash
- BE doi status code lam FE xu ly sai
- FE/BE khac kieu ngay, tien, enum, status

## Bao cao khi gap loi
- FE file + line
- BE file + line
- contract bi lech gi
- anh huong noi dung gi
- cach sua nho nhat

## API quan trong nhat
- auth / nguoi dung
- thuc don / danh muc
- ban / QR
- dat ban
- don hang
- ma giam gia validate
- danh gia
- diem tich luy
- thong ke
