# AGENTS.md

## Phạm vi
File này áp dụng cho toàn bộ thư mục `backend/`.

Ngoài các quy tắc trong file này, cần tiếp tục tôn trọng tinh thần từ `AGENTS.md` ở root: ưu tiên đặt tên mới rõ nghĩa theo nghiệp vụ, ưu tiên tiếng Việt không dấu khi phù hợp, và giữ tính nhất quán với convention đang có trong từng file.

## Vị trí của `backend/` trong repo hiện tại
Thu muc `backend/` la backend ASP.NET Core Web API chinh cua du an trong hien trang hien tai.

Trong do, `backend/apiquanlynhahang/apiquanlynhahang` la backend C# + MySQL dang duoc dung de phat trien, kiem thu va demo.

Vi vay khi lam viec trong `backend/`:
- xem day la nguon su that chinh cho contract backend hien tai
- uu tien sua dung backend C# trong `backend/apiquanlynhahang/apiquanlynhahang`
- giu tinh on dinh cho frontend dang ket noi vao backend nay

## Mục tiêu
Đây là backend ASP.NET Core Web API dùng C# và MySQL cho dự án quản lý nhà hàng. Thu muc `backend/apiquanlynhahang/apiquanlynhahang` la backend chinh dang duoc su dung.

Khi chỉnh sửa backend:
- ưu tiên sửa đúng chức năng được yêu cầu
- không sửa lan sang frontend nếu không thật sự cần
- không refactor lớn nếu chưa được yêu cầu
- giữ hệ thống chạy ổn định và tương thích với code hiện có trong chính `backend/`
- neu sua trong `backend/apiquanlynhahang/apiquanlynhahang`, can uu tien cap nhat tai lieu trang thai backend de nguoi sau nam duoc boi canh hien tai

## Công nghệ
- Ngôn ngữ: C#
- Framework: ASP.NET Core Web API
- Database: MySQL

## Cấu trúc cần tôn trọng
Ưu tiên giữ cấu trúc thư mục backend hiện có, ví dụ:
- `Controllers/`
- `Services/`
- `Repositories/`
- `Models/`
- `DTOs/`
- `Data/`
- `Properties/`

Không tự ý đổi tên hoặc di chuyển file hàng loạt nếu không có yêu cầu rõ ràng.

## Ngôn ngữ làm việc
- Trả lời, giải thích và mô tả bằng tiếng Việt.
- Ưu tiên đặt tên mới theo nghiệp vụ bằng tiếng Việt không dấu nếu phù hợp với style hiện tại.
- Nếu file hiện tại đang dùng convention tiếng Anh thì giữ nhất quán trong chính file đó, không đổi hàng loạt.

## Quy tắc chỉnh sửa backend
- Giữ nguyên contract API hiện có trong `backend/` nếu không có yêu cầu đổi.
- Không tự ý đổi route, tên field response, hoặc kiểu dữ liệu trả về.
- Không tự ý đổi schema database.
- Không tự ý xóa bảng, cột, dữ liệu, migration, hoặc cấu hình kết nối.
- Không hard-code chuỗi kết nối database, mật khẩu, token, hoặc khóa bí mật.
- Không sửa `appsettings.json` hoặc cấu hình môi trường nếu chưa được yêu cầu rõ.
- Không tự ý xóa log, file cấu hình, hoặc code đang dùng chỉ vì thấy chưa đẹp.
- Neu can doi chieu backend dang chay that, uu tien kiem tra trong `backend/apiquanlynhahang/apiquanlynhahang`.

## Quy tắc code
- Ưu tiên sửa ít nhất có thể nhưng đúng bản chất lỗi.
- Tách xử lý rõ ràng giữa controller, service, repository nếu code đang theo hướng đó.
- Validate input đầy đủ.
- Kiểm tra null và xử lý lỗi rõ ràng.
- Không nuốt lỗi im lặng.
- Không viết logic nguy hiểm có thể làm mất dữ liệu.

## Quy tắc MySQL
- Cẩn thận với `DELETE`, `UPDATE` không có `WHERE`.
- Không chạy truy vấn có nguy cơ làm hỏng dữ liệu diện rộng.
- Khi sửa truy vấn, phải chú ý khóa chính, khóa ngoại, ràng buộc và dữ liệu hiện có.
- Ưu tiên truy vấn rõ ràng, dễ kiểm tra, dễ bảo trì.

## Những gì không được tự ý làm
- Không tự ý đổi schema database.
- Không tự ý xóa cột, bảng, dữ liệu.
- Không tự ý đổi contract API.
- Không tự ý đổi cấu trúc thư mục lớn.
- Không tự ý thêm package nếu chưa thật cần.
- Không tự ý đổi cấu hình môi trường production/development.
- Khong tu y tao them backend song song khac roi coi la luong.

## Khi hoàn thành
Luôn báo rõ:
- đã sửa file nào
- sửa gì
- lý do sửa
- có ảnh hưởng API, database, hoặc dữ liệu hay không
- có ảnh hưởng gì đến backend C# chính hay frontend hay không
- cần kiểm tra thêm gì sau khi sửa
