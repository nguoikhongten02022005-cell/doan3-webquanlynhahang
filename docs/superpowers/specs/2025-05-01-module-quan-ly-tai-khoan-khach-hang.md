# SPEC: Module Quản Lý Tài Khoản Khách Hàng

## 1. Mục tiêu

Xây dựng module quản lý tài khoản khách hàng riêng biệt, tích hợp với hệ thống order hiện có, hỗ trợ:
- Đăng ký / Đăng nhập khách hàng
- Tích điểm tự động khi thanh toán (10,000đ = 1 điểm)
- Quản lý thông tin thành viên (xem/sửa)
- Đổi điểm qua mã giảm giá

## 2. Kiến trúc

### 2.1 Backend (NestJS)

```
modules/
├── auth/                    # Đã có - xác thực
├── khach-hang/              # Mở rộng - CRUD khách hàng
│   ├── khach-hang.controller.ts
│   ├── khach-hang.service.ts
│   ├── dto/
│   │   ├── tao-khach-hang.dto.ts
│   │   └── cap-nhat-khach-hang.dto.ts
│   └── khach-hang.module.ts
├── diem-tich-luy/           # MỚI - xử lý tích điểm
│   ├── diem-tich-luy.controller.ts
│   ├── diem-tich-luy.service.ts
│   ├── dto/
│   │   └── tao-ma-diem.dto.ts
│   └── diem-tich-luy.module.ts
└── don-hang/                # Mở rộng - gọi tích điểm khi thanh toán
```

### 2.2 Frontend (React)

```
pages/
├── DangNhapPage.jsx          # Mở rộng - thêm "Quên mật khẩu"
├── DangKyPage.jsx            # Mở rộng - thêm trường
├── HoSoPage.jsx             # MỚI - trang hồ sơ khách hàng
└── DiemTichLuyPage.jsx      # MỚI - trang xem điểm & đổi điểm

features/
└── diem-tich-luy/           # MỚI
    ├── DiemTichLuyPage.jsx
    ├── DiemTichLuyService.js
    └── DiemTichLuyAPI.js

components/
├── Header.jsx               # Mở rộng - hiển thị điểm & avatar
└── ThanhToan/               # Mở rộng - chọn điểm đổi
```

## 3. Database Schema (đã có - kiểm tra & bổ sung)

### Bảng KhachHang (đã có)
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| MaKH | VARCHAR(50) | PK |
| MaND | VARCHAR(50) | FK → NguoiDung |
| TenKH | VARCHAR(100) | Tên khách hàng |
| SDT | VARCHAR(20) | SĐT (unique) |
| DiaChi | VARCHAR(255) | Địa chỉ |
| DiemTichLuy | INT | Tổng điểm |
| NgayTao | DATETIME | Ngày tạo |

### Bảng LichSuDiemTichLuy (đã có)
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| MaGiaoDichDiem | VARCHAR(50) | PK |
| MaKH | VARCHAR(50) | FK → KhachHang |
| MaDonHang | VARCHAR(50) | FK → DonHang (nullable) |
| LoaiBienDong | ENUM | 'CONG','TRU','DIEU_CHINH' |
| SoDiem | INT | Số điểm thay đổi |
| SoDiemTruoc | INT | Điểm trước |
| SoDiemSau | INT | Điểm sau |
| MoTa | VARCHAR(255) | Mô tả giao dịch |
| NgayTao | DATETIME | Thời gian |

### Bảng MaGiamGia (đã có - cần thêm loại)
Cần thêm `LoaiMa` = ENUM('GiamGia','DiemTichLuy') để phân biệt mã giảm giá thường và mã từ điểm.

## 4. API Endpoints

### 4.1 Khách hàng

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/khach-hang/profile | Lấy thông tin khách hàng hiện tại |
| PUT | /api/khach-hang/profile | Cập nhật thông tin cá nhân |
| GET | /api/khach-hang/lich-su | Lịch sử đơn hàng |

### 4.2 Điểm tích lũy

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/diem-tich-luy | Lấy điểm hiện tại |
| GET | /api/diem-tich-luy/lich-su | Lịch sử tích/trừ điểm |
| POST | /api/diem-tich-luy/doi-diem | Đổi điểm → mã giảm giá |
| POST | /api/diem-tich-luy/tich-diem | Tích điểm (gọi nội bộ từ order) |

### 4.3 Đổi điểm thành mã giảm giá

- Tỷ lệ đổi: **100 điểm = 10,000đ giảm giá**
- Mã có hạn sử dụng 30 ngày
- Mỗi lần đổi tạo 1 record trong `LichSuDiemTichLuy` (loaiBienDong='TRU')

## 5. Luồng nghiệp vụ

### 5.1 Đăng ký khách hàng
1. Khách điền form (Họ tên, Email, SĐT, Mật khẩu)
2. Tạo NguoiDung(vaiTro='KhachHang') + KhachHang liên kết
3. Trả token JWT để đăng nhập tự động

### 5.2 Tích điểm khi thanh toán
1. Thanh toán thành công → gọi `diem-tich-luy.service.tichDiem(maKH, soTien)`
2. Tính điểm: `Math.floor(soTien / 10000)`
3. Cập nhật `KhachHang.DiemTichLuy`
4. Tạo `LichSuDiemTichLuy` (loaiBienDong='CONG')

### 5.3 Đổi điểm
1. Khách chọn số điểm muốn đổi (bội số của 100)
2. Hệ thống tạo mã giảm giá với giá trị tương ứng
3. Trừ điểm trong `KhachHang`
4. Tạo `LichSuDiemTichLuy` (loaiBienDong='TRU')

## 6. Giao diện

### 6.1 Trang Hồ Sơ (HoSoPage.jsx)
- Thông tin cá nhân: Họ tên, SĐT, Email, Địa chỉ
- Nút chỉnh sửa (inline edit)
- Nút đổi mật khẩu

### 6.2 Trang Điểm Tích Lũy (DiemTichLuyPage.jsx)
- Hiển thị số điểm hiện tại (big number)
- Lịch sử tích/trừ điểm (table có phân trang)
- Form đổi điểm: chọn số điểm → xem trước giá trị nhận được → xác nhận
- Danh sách mã giảm giá từ điểm (trạng thái: Chưa dùng/Đã dùng/Hết hạn)

## 7. Tích hợp order hiện tại

- Khi tạo HoaDon → kiểm tra MaKH có gắn không → tích điểm
- Hook vào `thanh-toan.service.thanhToan()` hoặc sau khi tạo HoaDon thành công
- Không sửa DonHang/HoaDon entity nếu không cần

## 8. Phạm vi công việc

### Backend
- [ ] Kiểm tra & mở rộng `khach-hang.service.ts`
- [ ] Kiểm tra & mở rộng `khach-hang.controller.ts`
- [ ] Tạo `diem-tich-luy/` module (service + controller)
- [ ] Thêm DTO cho các operation
- [ ] Cập nhật `app.module.ts` để import modules mới

### Frontend
- [ ] Mở rộng `HoSoPage.jsx` (nếu chưa đủ chức năng)
- [ ] Tạo `DiemTichLuyPage.jsx`
- [ ] Tạo services gọi API điểm tích lũy
- [ ] Cập nhật Header hiển thị điểm
- [ ] Cập nhật ThanhToanPage cho phép chọn dùng điểm

## 9. Đánh giá rủi ro

- **Rủi ro**: Khách không đăng nhập khi order → không tích điểm được
- **Giải pháp**: Yêu cầu đăng nhập nếu muốn tích điểm, hoặc cho nhập SĐT để gắn điểm sau