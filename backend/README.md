# Backend cũ tham khảo

## Vai trò trong repo hiện tại
Thư mục `backend/` là phần mã ASP.NET Core Web API cũ của dự án quản lý nhà hàng.

Hiện trạng repo:
- frontend đang chạy ở thư mục gốc với mã nguồn chính trong `src/`
- backend dùng cho phát triển và kiểm thử hiện tại nằm trong `server/`
- `backend/` được giữ lại để tham khảo lịch sử hoặc chỉnh sửa cục bộ khi có yêu cầu rõ ràng

Không nên coi `backend/` là máy chủ chuẩn để chạy ứng dụng hằng ngày nếu không có lý do rất cụ thể.

## Công nghệ của mã trong `backend/`
- C#
- ASP.NET Core Web API
- MySQL
- Có thể có Entity Framework Core tùy phần mã hiện còn trong dự án

## Khi nào nên dùng thư mục này
- Khi cần đọc lại cách làm cũ để đối chiếu nghiệp vụ
- Khi cần sửa một phần backend C# cũ theo yêu cầu riêng
- Khi cần tham khảo model, DTO, route hoặc cấu trúc dữ liệu lịch sử

## Khi nào không nên dùng thư mục này
- Không dùng làm backend chính cho luồng phát triển hiện tại
- Không dùng làm nguồn sự thật duy nhất cho contract API đang chạy thật
- Không tự suy ra rằng frontend hiện tại đang kết nối trực tiếp với phần mã trong `backend/`

## Cấu trúc thường gặp
Tùy theo phần mã còn lại, backend cũ có thể gồm các thư mục như:
- `Controllers/`
- `Models/`
- `Data/`
- `DTOs/`
- `Services/`
- `Repositories/`
- `Properties/`

## Nguyên tắc an toàn khi chỉnh sửa
- Chỉ sửa đúng phạm vi được yêu cầu
- Không tự ý xóa hàng loạt file hoặc migration cũ
- Không tự ý đổi schema database
- Không hard-code chuỗi kết nối, mật khẩu, token hoặc khóa bí mật
- Không tự ý sửa `appsettings.json` nếu chưa có yêu cầu rõ
- Không giả định thay đổi trong `backend/` sẽ tự động đồng bộ với `server/`

## Nguồn tham chiếu chính của hệ thống hiện tại
Nếu cần hiểu hệ thống đang chạy thật, hãy ưu tiên đọc:
- `README.md`
- `server/README.md`
- mã nguồn trong `server/`

## Ghi chú
Nếu sau này dự án quay lại dùng backend C# làm luồng chính, tài liệu trong thư mục này nên được cập nhật lại để phản ánh đúng trạng thái mới của repo.
