---
name: project-context
description: Use when needing repo-specific context before reviewing, debugging, checking business flow, API mapping, DB consistency, or writing reports.
type: reference
---

# 00 Project Context

## Tom tat
Repo nay la do an quan ly nha hang full-stack.
- FE: React 19 + Vite + React Router + Ant Design + TanStack Query
- BE: NestJS 10 + TypeScript + MySQL (`mysql2`) + JWT + Swagger
- DB: MySQL schema/seed nam trong `database/mysql_init_schema.sql` va `database/mysql_seed_dev.sql`

## Muc tieu he thong
- Phuc vu khach hang: xem thuc don, dang ky/dang nhap, dat ban, gio hang, thanh toan, ho so, lich su don/lich su dat ban, danh gia, goi mon tai ban qua QR, don mang ve.
- Phuc vu noi bo: dashboard, quan ly dat ban, so do ban, don hang, mon an, ma giam gia, khach hang, nhan vien, thong ke.

## Cong nghe
- Frontend: React, Vite, React Router, Ant Design, TanStack Query, dayjs, xlsx.
- Backend: NestJS, TypeScript, class-validator, class-transformer, bcryptjs, jsonwebtoken, swagger-ui-express.
- Database: MySQL 8+.
- Query layer: `mysql2` + SQL thu cong; khong thay dau hieu ORM.

## Cau truc quan trong
- `frontend/src/pages/` -> router pages khach hang + noi bo.
- `frontend/src/features/datBan/` -> flow dat ban.
- `frontend/src/features/noiBo/` -> dashboard + man noi bo.
- `frontend/src/hooks/useXacThuc.js` -> auth state frontend.
- `frontend/src/services/*.js` -> FE API services.
- `backend/nest-api/src/modules/*` -> controller/service/module theo nghiep vu.
- `backend/nest-api/src/common/` -> guard, decorator, helper, role, response shape.
- `database/mysql_init_schema.sql` -> schema + view + index + note nghiep vu.
- `database/mysql_seed_dev.sql` -> data mau local/demo.

## Module chinh
- Auth / NguoiDung
- ThucDon / DanhMuc
- Ban / QRCode
- DatBan
- DonHang
- MaGiamGia
- KhachHang
- DiemTichLuy
- DanhGia
- ThongBao
- ThongKe

## Luong khach hang
- Trang chu / gioi thieu / thuc don / dang ky / dang nhap.
- Dat ban -> chon ngay gio -> xac nhan.
- Ban QR -> goi mon tai ban -> don hang.
- Gio hang -> thanh toan -> hoa don / trang thai don.
- Ho so -> thong tin ca nhan + lich su dat ban + lich su don.
- Danh gia sau don du dieu kien.

## Luong admin/noi bo
- Dang nhap noi bo -> dashboard.
- Quan ly dat ban -> xac nhan / check-in / xep ban / hoan tat / huy.
- Quan ly ban -> so do / trang thai / QR.
- Quan ly don hang -> theo doi trang thai, lich su.
- Quan ly thuc don / ma giam gia / khach hang / nhan vien.
- Thong ke doanh thu, don, dat ban.

## API/service quan trong
- FE route goc dung `/api` base URL.
- Nhom API lon: `/api/auth`, `/api/nguoi-dung`, `/api/thuc-don`, `/api/ban`, `/api/dat-ban`, `/api/don-hang`, `/api/ma-giam-gia/validate`, `/api/danh-gia`, `/api/mang-ve`, `/api/diem-tich-luy`, `/api/thong-ke`.
- Backend prefix trong README va code can giu on dinh de khong vo contract FE.

## Bang DB chinh
- `NguoiDung`, `NhanVien`, `KhachHang`
- `Ban`, `QRCode`
- `DanhMuc`, `ThucDon`
- `MaGiamGia`
- `DatBan`, `DonHang`, `ChiTietDonHang`
- `HoaDon`, `ThanhToan`
- `DanhGia`
- `LichSuDonHang`, `LichSuDiemTichLuy`
- `ThongBao`

## Trang thai nghiep vu quan trong
- Ban: `Available`, `Occupied`, `Reserved`, `Maintenance`
- Dat ban: `Pending`, `Confirmed`, `Seated`, `Completed`, `Cancelled`, `NoShow` va bo trang thai moi cho internal flow.
- Don hang: `Pending`, `Confirmed`, `Preparing`, `Ready`, `Served`, `Paid`, `Cancelled`
- Thanh toan: `Pending`, `Success`, `Failed`, `Refunded`
- Danh gia: `Pending`, `Approved`, `Rejected`
- Ma giam gia: `Active`, `Inactive`, `HetHan`
- Vai tro: `Admin`, `NhanVien`, `KhachHang`

## File can can than khi sua
- `backend/nest-api/src/main.ts`
- `backend/nest-api/src/app.module.ts`
- `backend/nest-api/src/common/*`
- `backend/nest-api/src/modules/*/*.controller.ts`
- `backend/nest-api/src/modules/*/*.service.ts`
- `frontend/src/App.jsx`
- `frontend/src/hooks/useXacThuc.js`
- `frontend/src/services/*`
- `frontend/src/features/noiBo/*`
- `database/mysql_init_schema.sql`

## Quy tac vang
- Khong doi contract FE-BE neu chua xac nhan.
- Khong refactor lon.
- Khong format lan man.
- Khong doi DB structure/seed neu khong co yeu cau ro.
- Khi debug: doc context -> trace luong -> tim root cause -> sua nho nhat -> test lai.
- Khi review: xem FE, BE, DTO, DB mapping, auth/role, response shape, status flow.
