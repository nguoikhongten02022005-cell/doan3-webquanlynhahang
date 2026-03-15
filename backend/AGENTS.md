# AGENTS.md

## Phạm vi
File này áp dụng cho toàn bộ thư mục `backend/`.

Ngoài các quy tắc trong file này, cần tiếp tục tôn trọng tinh thần từ `AGENTS.md` ở root: ưu tiên đặt tên mới rõ nghĩa theo nghiệp vụ, ưu tiên tiếng Việt không dấu khi phù hợp, và giữ tính nhất quán với convention đang có trong từng file.

## Vị trí của `backend/` trong repo hiện tại
Thư mục `backend/` là phần mã ASP.NET Core Web API cũ, được giữ lại chủ yếu để tham khảo lịch sử hoặc chỉnh sửa cục bộ khi có yêu cầu rõ ràng.

Backend đang dùng cho luồng phát triển và kiểm thử hiện tại của dự án nằm ở `server/`.

Vì vậy khi làm việc trong `backend/`:
- không xem đây là nguồn sự thật chính cho contract đang chạy hằng ngày
- chỉ chỉnh khi yêu cầu thật sự liên quan đến phần mã C# cũ hoặc cần đối chiếu lịch sử
- không tự suy diễn rằng mọi thay đổi trong `backend/` sẽ tự động áp dụng cho hệ thống đang chạy bằng `server/`

## Mục tiêu
Đây là backend ASP.NET Core Web API dùng C# và MySQL cho dự án quản lý nhà hàng, nhưng ở trạng thái hiện tại nó đóng vai trò mã cũ để tham khảo là chính.

Khi chỉnh sửa backend:
- ưu tiên sửa đúng chức năng được yêu cầu
- không sửa lan sang frontend nếu không thật sự cần
- không refactor lớn nếu chưa được yêu cầu
- giữ hệ thống chạy ổn định và tương thích với code hiện có trong chính `backend/`

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
- Nếu cần đối chiếu với backend đang chạy thật, ưu tiên kiểm tra `server/` thay vì suy luận từ `backend/`.

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
- Không tự ý coi `backend/` là backend chính của repo hiện tại.

## Khi hoàn thành
Luôn báo rõ:
- đã sửa file nào
- sửa gì
- lý do sửa
- có ảnh hưởng API, database, hoặc dữ liệu hay không
- có ảnh hưởng gì đến `server/` hay không
- cần kiểm tra thêm gì sau khi sửa
