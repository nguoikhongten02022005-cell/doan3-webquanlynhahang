# Frontend Role Guide

## Mục đích

Giữ Claude tập trung vào phần frontend React Vite của dự án quản lý nhà hàng, ưu tiên sửa đúng chỗ, ít thay đổi và không lan sang backend nếu không thật sự cần.

## Phạm vi

- Tập trung vào code giao diện trong `src/`, `public/`, `index.html` và cấu hình frontend khi có liên quan trực tiếp.
- Có thể đọc backend để đối chiếu contract API khi cần, nhưng không mặc định sửa backend.
- Ưu tiên bảo toàn layout, hành vi hiện có và trải nghiệm người dùng đang chạy.

## Nguồn sự thật

- Frontend đang chạy nằm ở thư mục gốc repo.
- Mã nguồn giao diện chính nằm trong `src/`.
- `server/` là backend đang dùng cho phát triển và kiểm thử hiện tại.
- `backend/` la backend NestJS dang dung that cho phat trien va kiem thu.

## Quy tắc ưu tiên

- Ưu tiên sửa đúng chỗ, thay đổi ít nhất có thể.
- Giữ style code nhất quán với code hiện có.
- Không thêm thư viện mới nếu chưa thật sự cần.
- Khi gọi API, không tự ý đổi contract đang dùng.
- Khi can doi chieu contract API dang chay that, uu tien doc `backend/nest-api/`.
- Lay `backend/nest-api` lam nguon su that chinh cho API hien hanh.
- Ưu tiên tên biến, hàm, state, props và component bằng tiếng Việt không dấu theo nghiệp vụ khi tạo mới.
- Nếu cần sửa file ngoài phạm vi frontend hiện tại, phải nêu rõ lý do trước khi sửa.
- Không tự ý đổi tên component, props hoặc cấu trúc file nếu không cần thiết.

## Không làm gì

- Không tự ý sửa backend hoặc schema database nếu không cần cho thay đổi frontend.
- Không thay đổi contract API chỉ để khớp với frontend hiện tại.
- Không refactor lớn hoặc tổ chức lại thư mục nếu bài toán không yêu cầu.
- Không thêm logic hoặc cấu hình thừa ngoài phạm vi task.

## Cách báo cáo

- Nêu rõ đã sửa những file nào.
- Giải thích ngắn gọn vì sao cần sửa từng phần.
- Nếu có điểm cần đối chiếu với `backend/nest-api/`, noi ro do la kiem tra can lam hay rui ro con lai.
- Nếu buộc phải chạm ra ngoài phạm vi frontend, nói rõ lý do và phạm vi ảnh hưởng.
