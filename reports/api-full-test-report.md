# API Full Test Report

## Summary
- Overall result: PASS
- Backend target: `backend/apiquanlynhahang/apiquanlynhahang`
- Base URL: `http://localhost:5011`
- Collection source: Swagger/OpenAPI tại `GET /swagger/v1/swagger.json` (không có Postman collection trong repo)
- Retest performed: yes

## Environment
- Startup path: `D:/doan3-webquanlynhahang/backend/apiquanlynhahang/apiquanlynhahang/apiquanlynhahang.csproj`
- Runtime command: `dotnet run --project "D:/doan3-webquanlynhahang/backend/apiquanlynhahang/apiquanlynhahang/apiquanlynhahang.csproj" --launch-profile http`
- Database target: MySQL local theo `appsettings.json` → `server=localhost;port=3306;database=doan3quanlynhahang;user=root;password=123456;`
- Seed/reset path used: drop/create DB local `doan3quanlynhahang`, apply EF migration tự động khi startup, seed dev qua `Data/DuLieuPhatTrienKhoiTao.cs`
- Auth source: JWT qua `api/auth/*`

## Commands Run
- `dotnet build "D:/doan3-webquanlynhahang/backend/apiquanlynhahang/apiquanlynhahang/apiquanlynhahang.csproj"`
- `dotnet run --project "D:/doan3-webquanlynhahang/backend/apiquanlynhahang/apiquanlynhahang/apiquanlynhahang.csproj" --launch-profile http`
- `curl -i http://localhost:5011/swagger/index.html`
- `curl -s http://localhost:5011/swagger/v1/swagger.json`
- `curl -s -X POST http://localhost:5011/api/auth/register -H "Content-Type: application/json" -d '{"fullName":"API Test User","username":"apitestuser","email":"apitestuser@example.com","password":"secret123","phone":"0900000001"}'`
- `"/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -h localhost -P 3306 -u root -p123456 -e "SHOW DATABASES;"`
- `"/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -h localhost -P 3306 -u root -p123456 -D quannhahang -e "SHOW TABLES;"`
- `dotnet tool install --tool-path "D:/doan3-webquanlynhahang/.tools" dotnet-ef --version 9.0.0`
- `"D:/doan3-webquanlynhahang/.tools/dotnet-ef" migrations add InitialCreate --project "D:/doan3-webquanlynhahang/backend/apiquanlynhahang/apiquanlynhahang/apiquanlynhahang.csproj" --startup-project "D:/doan3-webquanlynhahang/backend/apiquanlynhahang/apiquanlynhahang/apiquanlynhahang.csproj"`
- `"/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -h localhost -P 3306 -u root -p123456 -e "DROP DATABASE IF EXISTS doan3quanlynhahang; CREATE DATABASE doan3quanlynhahang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
- `"/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -h localhost -P 3306 -u root -p123456 -D doan3quanlynhahang -e "SHOW TABLES; SELECT email, ten_dang_nhap, vai_tro, trang_thai FROM nguoi_dung; SELECT id, ten_khu_vuc FROM khu_vuc_ban; SELECT id, ma_ban, ten_ban, khu_vuc_id, trang_thai FROM ban_an; SELECT ma_giam, loai_giam, gia_tri_giam, dang_hoat_dong FROM ma_giam_gia;"`
- `curl -s -X POST http://localhost:5011/api/auth/login -H "Content-Type: application/json" -d '{"identifier":"customer@nhahang.local","password":"secret123"}'`
- `curl -s -X POST http://localhost:5011/api/auth/internal-login -H "Content-Type: application/json" -d '{"identifier":"staff@nhahang.local","password":"secret123"}'`
- `python ...` (script smoke flow cho `auth/me`, `ban-an`, `ma-giam-gia/validate`, `dat-ban`, `don-hang`)
- `python ...` (script regression mở rộng cho `nguoi-dung`, `bao-cao`, `nguyen-lieu`, `phieu-nhap-kho`, `cong-thuc-mon`, `qr`, `403`, `404`, `409`)

## Test Scope
- Modules or folders covered: startup/build, Swagger availability, DB alignment, auth, nguoi-dung, ban an, bao cao, voucher, dat ban, don hang, QR, kho nguyen lieu, phieu nhap kho, cong thuc mon
- Endpoint groups added locally: smoke flow script và regression script mở rộng dùng token seeded local
- DB side-effect checks performed: xác nhận bảng migrate thành công; xác nhận seed `nguoi_dung`, `khu_vuc_ban`, `ban_an`, `ma_giam_gia`; xác nhận tạo được bản ghi `dat_ban`, `don_hang`, `nguyen_lieu`, `cong_thuc_mon_an`, `phieu_nhap_kho`; xác nhận trừ kho khi hoàn thành đơn hàng có công thức

## Passed
- `GET /swagger/index.html` - ứng dụng khởi động thành công và phục vụ Swagger UI trên `http://localhost:5011`
- `GET /swagger/v1/swagger.json` - lấy được danh sách route để map phạm vi test
- `dotnet build` - build backend thành công, không warning/error sau khi thêm migration + seed
- `POST /api/auth/login` - đăng nhập thành công bằng tài khoản seed `customer@nhahang.local`
- `POST /api/auth/internal-login` - đăng nhập nội bộ thành công bằng tài khoản seed `staff@nhahang.local`
- `GET /api/auth/me` - trả về hồ sơ user hợp lệ với JWT mới
- `GET /api/nguoi-dung` - admin truy cập thành công
- `GET /api/bao-cao/tong-quan` - staff truy cập thành công
- `GET /api/ma-giam-gia` - staff xem danh sách mã giảm giá thành công
- `POST /api/ma-giam-gia` - admin tạo mã giảm giá thành công
- `GET /api/ban-an` - trả về bàn seed local
- `GET /api/ban-an/available-for-booking/1` - trả về bàn khả dụng đúng theo booking
- `POST /api/dat-ban` - tạo booking thành công
- `PATCH /api/dat-ban/1/assign-tables` - gán bàn thành công
- `POST /api/don-hang` - tạo đơn hàng thành công với mã giảm giá và món seed local
- `PATCH /api/don-hang/1/status` - cập nhật `DA_HOAN_THANH` thành công và chạy trừ kho
- `POST /api/ma-giam-gia/validate` - validate thành công mã `LOCAL10`
- `GET /api/qr/ban/TOKEN-BAN01` - lấy thông tin bàn qua QR thành công
- `GET /api/qr/ban/TOKEN-BAN01/mon-an` - lấy menu theo QR thành công
- `POST /api/qr/ban/TOKEN-BAN02/don-hang` - tạo đơn hàng qua QR thành công
- `GET /api/nguyen-lieu` - staff xem danh sách nguyên liệu thành công
- `POST /api/nguyen-lieu` - tạo nguyên liệu thành công
- `GET /api/nguyen-lieu/1` - xem chi tiết nguyên liệu thành công
- `POST /api/cong-thuc-mon` - tạo công thức món ăn thành công
- `GET /api/cong-thuc-mon/1` - xem công thức theo món thành công
- `POST /api/phieu-nhap-kho` - tạo phiếu nhập kho thành công
- `GET /api/phieu-nhap-kho` - xem danh sách phiếu nhập thành công
- `GET /api/phieu-nhap-kho/1` - xem chi tiết phiếu nhập thành công
- `GET /api/bao-cao/top-mon-ban-chay` - trả về dữ liệu tổng hợp hợp lệ
- `GET /api/bao-cao/canh-bao-kho` - trả về dữ liệu hợp lệ

## Failed
- Không còn lỗi blocker trong các nhóm API đã test.
- Chưa chạy exhaustively mọi biến thể input của tất cả route, nhưng regression chính và negative case cốt lõi đều pass.

## Root Cause Analysis
- Failure ban đầu: `POST /api/auth/register` trả về `{"message":"Da xay ra loi he thong"}`
  Cause: mismatch giữa connection string runtime và database/schema thực tế trên MySQL local
  Evidence: log runtime báo `Unknown database 'doan3quanlynhahang'`; `appsettings.json` dùng DB `doan3quanlynhahang`; MySQL local chỉ có DB legacy `quannhahang`

- Failure nền tảng: backend không thể dùng file SQL cũ để test ổn định
  Cause: `Data/mysql_init_doan3quanlynhahang.sql` là schema legacy, không khớp `UngDungDbContext.cs`
  Evidence: code hiện tại map sang bảng snake_case như `nguoi_dung`, `ban_an`, `token_lam_moi`, `khu_vuc_ban`, ... trong khi SQL cũ tạo bảng legacy kiểu `NguoiDung`, `Ban`, `DonHang`, ...

## Fixes Applied
- File: `backend/apiquanlynhahang/apiquanlynhahang/Program.cs`
  Change: thêm migrate + seed tự động trong Development bằng `Database.MigrateAsync()` và `DuLieuPhatTrienKhoiTao.DamBaoDuLieuMauAsync(...)`
  Reason: đảm bảo local DB được dựng đúng schema hiện tại của code mỗi khi chạy backend

- File: `backend/apiquanlynhahang/apiquanlynhahang/Data/DuLieuPhatTrienKhoiTao.cs`
  Change: thêm seed idempotent cho `nguoi_dung`, `khu_vuc_ban`, `ban_an`, `ma_giam_gia` và reuse seed món ăn hiện có
  Reason: tạo đủ dữ liệu tối thiểu để chạy smoke/regression cốt lõi

- File: `backend/apiquanlynhahang/apiquanlynhahang/Migrations/20260328021936_InitialCreate.cs`
  Change: tạo baseline migration đầu tiên cho schema hiện tại
  Reason: biến `UngDungDbContext` thành schema source có thể tái tạo được

- File: `backend/apiquanlynhahang/apiquanlynhahang/Migrations/20260328021936_InitialCreate.Designer.cs`
  Change: snapshot metadata của migration
  Reason: hỗ trợ EF Core quản lý schema hiện tại

- File: `backend/apiquanlynhahang/apiquanlynhahang/Migrations/UngDungDbContextModelSnapshot.cs`
  Change: lưu model snapshot mới
  Reason: hỗ trợ migration tiếp theo về sau

- File: `backend/apiquanlynhahang/apiquanlynhahang/README.md`
  Change: cập nhật hướng dẫn local theo migration + seed thay vì SQL legacy
  Reason: tránh drift tài liệu và cách bootstrap thực tế

- File: `backend/apiquanlynhahang/apiquanlynhahang/BACKEND_STATUS.md`
  Change: cập nhật trạng thái MySQL/schema local theo migration + seed mới
  Reason: phản ánh đúng cách dựng môi trường hiện tại

## Retest Result
- Targeted retest: pass
- Full retest: pass
- Delta from original run: từ trạng thái blocked do DB mismatch sang trạng thái migrate + seed + pass smoke và regression chính cho auth/role/CRUD/report/QR/kho

## Remaining Risks
- Chưa chạy fuzz/boundary test cực rộng cho mọi field của mọi DTO.
- Chưa có test automation cố định; hiện mới là regression thủ công bằng script/curl.
- File SQL legacy vẫn còn trong repo, dù local setup đã chuyển sang migration-first.

## Next Actions
- Nếu muốn giữ trạng thái ổn định lâu dài, nên commit migration + seed mới.
- Nên bổ sung test integration tự động cho các luồng chính vừa verify.
- Có thể dọn hoặc đánh dấu deprecated cho `Data/mysql_init_doan3quanlynhahang.sql` để tránh dùng nhầm về sau.
