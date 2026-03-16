# HIỆN TRẠNG HỆ THỐNG

## 1. Mục đích file
File này mô tả hiện trạng thực tế của hệ thống dựa trên mã nguồn và cấu trúc repo hiện tại.

Mục tiêu:
- giúp hiểu dự án hiện đang có gì
- xác định frontend đang chạy ở đâu
- xác định backend nào là backend chính của repo hiện tại
- tóm tắt các nhóm chức năng nghiệp vụ đã có
- làm cơ sở để chỉnh sửa an toàn mà không hiểu sai kiến trúc hiện hành

## 2. Kiến trúc hiện tại của repo
Hiện trạng chính:
- frontend chạy ở thư mục gốc của repo
- mã nguồn giao diện chính nằm trong `src/`
- frontend dùng React và Vite
- backend chính đang dùng cho phát triển và kiểm thử hiện tại nằm trong `backend/apiquanlynhahang/apiquanlynhahang`

Điều quan trọng:
- khi cần hiểu contract API đang chạy thật, ưu tiên đọc và đối chiếu `backend/apiquanlynhahang/apiquanlynhahang`
- xem backend C# là nguồn sự thật chính cho hệ thống hiện hành

## 3. Tổng quan chức năng hệ thống

### 3.1 Khu vực khách hàng
Hệ thống hiện có các nhóm chức năng giao diện chính:
- trang chủ
- xem thực đơn
- đặt bàn
- giỏ hàng
- thanh toán
- giới thiệu nhà hàng

### 3.2 Tài khoản khách hàng
Hệ thống hiện có:
- đăng ký
- đăng nhập
- xem hồ sơ cá nhân
- xem lịch sử đơn hàng
- xem lịch sử đặt bàn
- hủy booking nếu trạng thái còn cho phép

### 3.3 Khu vực nội bộ
Hệ thống hiện có:
- đăng nhập nội bộ
- dashboard vận hành
- quản lý booking
- quản lý bàn
- theo dõi đơn đang mở

### 3.4 Khu vực quản trị
Ngoài dashboard chung, admin hiện có thêm:
- quản lý món ăn
- xem danh sách tài khoản nội bộ

## 4. Các route giao diện chính
Các route chính được tổ chức trong frontend hiện tại, bao gồm:
- `/`
- `/thuc-don`
- `/dat-ban`
- `/gio-hang`
- `/thanh-toan`
- `/gioi-thieu`
- `/ho-so`
- `/dang-nhap`
- `/dang-ky`
- `/noi-bo/dang-nhap`
- `/noi-bo/bang-dieu-khien`

## 5. Backend chính đang dùng
Backend chính của repo hiện tại nằm trong `backend/apiquanlynhahang/apiquanlynhahang/`.

Stack của backend này:
- C#
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT
- Swagger

Các ghi chú quan trọng:
- frontend hiện tại được đối chiếu và tích hợp theo contract từ backend C#
- khi cần kiểm tra schema, route hoặc hành vi API, ưu tiên xem mã nguồn trong `backend/apiquanlynhahang/apiquanlynhahang/`
- `backend/apiquanlynhahang/apiquanlynhahang/README.md` là tài liệu ngắn gọn phản ánh backend đang chạy thật

## 6. Vai trò của `backend/`
Thư mục `backend/` là backend chính đang chạy hằng ngày của repo hiện tại.

Trong đó:
- `backend/apiquanlynhahang/apiquanlynhahang` là khu vực backend C# chính
- frontend hiện tại đang kết nối trực tiếp vào backend này

## 7. Ý nghĩa khi chỉnh sửa hệ thống
Để sửa đúng theo hiện trạng repo:
- sửa giao diện thì ưu tiên đọc `src/`, `README.md`, `backend/apiquanlynhahang/apiquanlynhahang/README.md`
- sửa backend đang chạy thật thì ưu tiên làm trong `backend/apiquanlynhahang/apiquanlynhahang`

Nếu đổi contract API trong backend C#, cần kiểm tra ảnh hưởng tới:
- thực đơn
- giỏ hàng
- thanh toán
- hồ sơ người dùng
- lịch sử đơn hàng
- lịch sử đặt bàn
- dashboard nội bộ

## 8. Ghi chú nghiệp vụ
Về mặt nghiệp vụ, hệ thống hiện không chỉ có giao diện public mà còn bao gồm:
- xác thực người dùng
- đơn hàng
- đặt bàn
- bàn ăn
- dashboard nội bộ
- món ăn
- tài khoản và vai trò người dùng

Điều này có nghĩa là mọi thay đổi backend hoặc frontend nên bám sát nghiệp vụ nhà hàng hiện có, tránh hiểu quá đơn giản rằng dự án chỉ gồm menu và giỏ hàng.

## 9. Kết luận
Hiện trạng repo nên được hiểu theo thứ tự ưu tiên sau:
- frontend chính: `src/` ở root, dùng React + Vite
- backend chính đang chạy: `backend/apiquanlynhahang/apiquanlynhahang/`

Khi cần chỉnh sửa an toàn và đúng thực tế:
- lấy `README.md` làm điểm bắt đầu
- lấy `backend/apiquanlynhahang/apiquanlynhahang/` làm nguồn sự thật cho backend hiện hành
