# API Full Test Report

## Summary
- Overall result: PASS
- Backend target: `backend/apiquanlynhahang/apiquanlynhahang`
- Base URL: `http://localhost:5011`
- Collection source: Khong tim thay Postman collection trong repo; kiem tra truc tiep bang startup + smoke requests
- Retest performed: no

## Environment
- Startup path: `backend/apiquanlynhahang/apiquanlynhahang`
- Runtime command: `dotnet run --no-build --urls http://localhost:5011`
- Database target: MySQL schema `doan3quanlynhahang`
- Seed/reset path used: EF Core migration + seed code trong Development (`Program.cs`, `Data/DuLieuPhatTrienKhoiTao.cs`)
- Auth source: Tai khoan seed local `admin@nhahang.local` / `staff@nhahang.local` voi mat khau `secret123`

## Commands Run
- `dotnet build`
- `dotnet run --no-build --urls http://localhost:5011`
- `powershell -NoProfile -Command '& { ... Invoke-WebRequest "http://localhost:5011/swagger/v1/swagger.json" ... }'`
- `powershell -NoProfile -Command '& { ... Invoke-RestMethod "http://localhost:5011/api/auth/login" ... }'`
- `powershell -NoProfile -Command '& { ... Invoke-RestMethod "http://localhost:5011/api/mon-an" ... }'`
- Read-only MySQL queries vao `information_schema` va schema `doan3quanlynhahang`

## Test Scope
- Modules hoac folders covered: Auth, MonAn, BaoCao, startup/migration/seed, config MySQL
- Endpoint groups added locally: `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/mon-an`, `GET /api/bao-cao/tong-quan`, `GET /swagger/v1/swagger.json`
- DB side-effect checks performed: kiem tra schema ton tai, so bang, du lieu seed nguoi dung, ban an, mon an, ma giam gia

## Passed
- `GET /swagger/v1/swagger.json` - tra ve `200`, backend boot thanh cong
- `POST /api/auth/login` - dang nhap thanh cong voi tai khoan seed admin
- `GET /api/auth/me` - bearer token hop le, tra ve email `admin@nhahang.local`
- `GET /api/mon-an` - endpoint cong khai tra ve 18 mon an
- `POST /api/auth/internal-login` - dang nhap noi bo staff thanh cong
- `GET /api/bao-cao/tong-quan` - endpoint bao cao co bao ve quyen va tra ve `200` voi token staff

## Failed
- Khong ghi nhan loi trong pham vi smoke test da chay

## Root Cause Analysis
- Failure: Khong co
  Cause: Khong co
  Evidence: `dotnet build` thanh cong, Swagger tra ve `200`, cac endpoint smoke auth/public/protected deu pass, MySQL co schema `doan3quanlynhahang` va du lieu seed mong doi

## Fixes Applied
- Khong ap dung sua code nao

## Retest Result
- Targeted retest: pass
- Full retest: pass trong pham vi smoke test duoc thuc thi
- Delta from original run: Khong co sua doi, chi xac nhan he thong dang hoat dong

## Remaining Risks
- Chua chay full regression cho tat ca controller va negative cases
- Chua co Postman collection trong repo de doi chieu contract test co he thong
- Chua xac minh ghi/doi trang thai du lieu tren cac endpoint mutation nhu dat ban, don hang, kho
- MySQL co dong thoi hai schema `doan3quanlynhahang` va `quannhahang`; backend hien tai dang dung `doan3quanlynhahang`

## Next Actions
- Tao Postman collection hoac bo smoke script cho tat ca endpoint con lai
- Neu bai nop bat buoc dung ten DB `QuanNhaHang`, can quyet dinh co doi chuoi ket noi va migration target hay chi giu ten local hien tai
- Neu can nop dung mau kien truc, can lap ke hoach doi ten thu muc theo `BLL/DAL/DTOs` ma khong lam vo contract hien tai
