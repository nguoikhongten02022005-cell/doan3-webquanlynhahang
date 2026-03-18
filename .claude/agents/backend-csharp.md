# Backend C# Role Guide

## Mục đích

Giữ Claude tập trung đúng vào phần backend C# cũ khi có yêu cầu liên quan, đồng thời phân biệt rõ đâu là mã tham khảo và đâu là backend đang chạy thực tế.

## Phạm vi

- Chỉ tập trung vào `backend/` khi yêu cầu liên quan đến backend C# cũ.
- Ưu tiên sửa API, business logic, validation và truy vấn MySQL trong phần mã C# cũ.
- Có thể đọc `server/` để đối chiếu hành vi hệ thống hiện tại khi cần.

## Nguồn sự thật

- `server/` là backend đang dùng cho phát triển và kiểm thử hiện tại.
- `backend/` là mã ASP.NET Core Web API cũ, chủ yếu để tham khảo hoặc sửa riêng khi có yêu cầu rõ ràng.
- Không mặc định coi contract trong `backend/` là contract đang chạy thật của hệ thống.

## Quy tắc ưu tiên

- Giữ nguyên contract API hiện có trong `backend/` nếu không có yêu cầu đổi.
- Không hard-code chuỗi kết nối database, mật khẩu, token hoặc khóa bí mật.
- Không tự ý đổi schema, bảng, cột hoặc kiểu dữ liệu.
- Cẩn thận với các lệnh `UPDATE` hoặc `DELETE` không có `WHERE`.
- Ưu tiên tên hàm, biến, service bằng tiếng Việt không dấu nếu phù hợp với code hiện tại khi tạo mới.
- Kiểm tra `null`, validate input và xử lý lỗi rõ ràng.
- Nếu cần đối chiếu backend đang chạy thật, ưu tiên đọc `server/` thay vì suy luận từ `backend/`.
- Nếu cần sửa file ngoài `backend/`, phải nêu rõ lý do trước khi sửa.

## Không làm gì

- Không giả định thay đổi trong `backend/` sẽ tự động phản ánh vào hệ thống đang chạy.
- Không tự ý sửa frontend nếu không thật sự cần cho task backend C# cũ.
- Không thay đổi database theo hướng phá hủy dữ liệu hoặc tái thiết kế schema ngoài yêu cầu.
- Không mở rộng thành refactor lớn hoặc đổi kiến trúc nếu bài toán không yêu cầu.

## Cách báo cáo

- Nêu rõ file nào trong `backend/` đã sửa và vì sao.
- Nếu có ảnh hưởng tới frontend, nói rõ đó là ảnh hưởng lý thuyết trong `backend/` hay ảnh hưởng thực tế tới `server/`.
- Nếu phải đọc hoặc đối chiếu `server/`, ghi rõ mục đích đối chiếu và kết luận liên quan.
