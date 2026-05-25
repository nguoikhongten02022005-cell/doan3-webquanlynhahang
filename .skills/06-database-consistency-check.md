---
name: database-consistency-check
description: Use when verifying schema, seed data, FK relationships, counts, or business data consistency with MySQL in this repo.
type: technique
---

# 06 Database Consistency Check

## Bang chinh
- `NguoiDung`, `NhanVien`, `KhachHang`
- `Ban`, `QRCode`
- `DanhMuc`, `ThucDon`
- `MaGiamGia`
- `DatBan`, `DonHang`, `ChiTietDonHang`
- `HoaDon`, `ThanhToan`
- `DanhGia`
- `LichSuDonHang`, `LichSuDiemTichLuy`
- `ThongBao`

## Quan he can soi
- `NhanVien.MaND -> NguoiDung.MaND`
- `KhachHang.MaND -> NguoiDung.MaND`
- `QRCode.MaBan -> Ban.MaBan`
- `ThucDon.MaDanhMuc -> DanhMuc.MaDanhMuc`
- `DatBan -> KhachHang / Ban / NhanVien`
- `DonHang -> KhachHang / Ban / NhanVien / DatBan`
- `ChiTietDonHang -> DonHang / ThucDon`
- `HoaDon -> DonHang / KhachHang / MaGiamGia`
- `ThanhToan -> HoaDon`
- `DanhGia -> KhachHang / DonHang`
- `LichSuDonHang -> DonHang`
- `LichSuDiemTichLuy -> KhachHang / DonHang`
- `ThongBao -> NguoiDung`

## SELECT an toan
- `SHOW TABLES`
- `DESCRIBE table`
- `SHOW CREATE TABLE table`
- `SELECT COUNT(*) FROM table`
- `SELECT ... LIMIT ...`
- `EXPLAIN SELECT ...`

## Kiem tra data hay gap
- don hang / hoa don / thanh toan
- booking / xep ban / trang thai ban
- diem tich luy
- review / trang thai review
- voucher usage / het han / gioi han
- user role / trang thai active

## Loi data thuong gap
- FK orphans
- sai trang thai
- double payment / hoa don trung
- booking co ban nhung ban van available
- diem khong khop lich su
- voucher dung vuot so lan
- review khong gan don hop le

## Rule bat buoc
- Khong sua DB neu chua xin phep.
- Khong chay write query.
- Chi doc va doi chieu.
