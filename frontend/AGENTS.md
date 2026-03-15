# AGENTS.md

## Phạm vi
File này là bộ quy tắc dành cho phần frontend hiện tại của repo.

Frontend hiện tại không nằm trong một thư mục `frontend/` riêng để chạy chính, mà nằm ở thư mục gốc với mã nguồn giao diện chủ yếu trong `src/`.

Vì vậy, khi làm việc với frontend hiện tại, hãy áp dụng các quy tắc trong file này cho:
- `src/`
- `public/`
- `index.html`
- các file cấu hình frontend ở root như `vite.config.js`, `eslint.config.js`, `package.json` nếu thay đổi thật sự liên quan đến giao diện

Ngoài các quy tắc trong file này, cần tiếp tục tôn trọng tinh thần từ `AGENTS.md` ở root: ưu tiên đặt tên mới rõ nghĩa theo nghiệp vụ, ưu tiên tiếng Việt không dấu khi phù hợp, và giữ tính nhất quán với convention đang có trong từng file.

## Mục tiêu
Đây là frontend dùng React và Vite cho dự án quản lý nhà hàng.

Khi chỉnh sửa frontend:
- ưu tiên sửa đúng màn hình, luồng, hoặc hành vi được yêu cầu
- không sửa lan sang backend nếu không thật sự cần
- không refactor lớn nếu chưa được yêu cầu
- giữ trải nghiệm ổn định, dễ dùng và tương thích với code hiện có

## Vị trí của frontend trong repo hiện tại
Hiện trạng repo:
- frontend chạy ở thư mục gốc
- mã nguồn giao diện chính nằm trong `src/`
- backend đang dùng thật cho phát triển và kiểm thử nằm trong `server/`
- `backend/` là mã C# cũ để tham khảo, không phải backend chính đang chạy hằng ngày

Khi cần đối chiếu API đang chạy thật, ưu tiên đọc `README.md`, `server/README.md` và mã nguồn trong `server/`.

## Công nghệ
- Ngôn ngữ chính: JavaScript hoặc JSX theo code hiện có
- Framework/UI: React
- Build tool: Vite
- Routing: giữ theo cách dự án đang dùng

## Cấu trúc cần tôn trọng
Ưu tiên giữ cấu trúc frontend hiện có, ví dụ:
- `src/components/`
- `src/pages/`
- `src/layouts/`
- `src/features/`
- `src/context/`
- `src/hooks/`
- `src/services/`
- `src/utils/`
- `src/constants/`
- `src/data/`
- `src/assets/`

Không tự ý đổi tên hoặc di chuyển file hàng loạt nếu không có yêu cầu rõ ràng.

## Ngôn ngữ làm việc
- Trả lời, giải thích và mô tả bằng tiếng Việt.
- Ưu tiên đặt tên mới theo nghiệp vụ bằng tiếng Việt không dấu nếu phù hợp với style hiện tại.
- Nếu file hiện tại đang dùng convention tiếng Anh thì giữ nhất quán trong chính file đó, không đổi hàng loạt.

## Quy tắc chỉnh sửa frontend
- Không tự ý đổi luồng nghiệp vụ hoặc hành vi chính của màn hình nếu không có yêu cầu.
- Không tự ý đổi contract gọi API nếu chưa xác nhận backend hỗ trợ.
- Không tự ý đổi key dữ liệu, tên field, hoặc format dữ liệu đang dùng giữa frontend và backend.
- Không tự ý thay toàn bộ layout, theme, hoặc hệ thống style nếu chưa được yêu cầu rõ.
- Không tự ý thêm thư viện nếu chưa thật sự cần.
- Không hard-code URL API, token, mật khẩu, hoặc khóa bí mật.
- Không sửa cấu hình môi trường nếu chưa được yêu cầu rõ.
- Không lấy `backend/` làm nguồn sự thật chính để suy luận contract API hiện hành.

## Quy tắc code
- Ưu tiên sửa ít nhất có thể nhưng đúng bản chất lỗi.
- Giữ component rõ trách nhiệm, dễ đọc, dễ kiểm tra.
- Tách logic dùng lại được vào `hooks/`, `utils/`, `services/` nếu cấu trúc hiện tại đang theo hướng đó.
- Kiểm tra null, undefined, danh sách rỗng và trạng thái loading/error đầy đủ khi cần.
- Không nuốt lỗi im lặng; nếu có xử lý lỗi thì phải rõ ràng.
- Hạn chế tạo state dư thừa hoặc effect phức tạp không cần thiết.
- Giữ tương thích tốt trên desktop và mobile nếu thay đổi liên quan giao diện.

## Quy tắc giao diện
- Tôn trọng design hiện có của dự án, không làm lệch phong cách chung nếu không có yêu cầu đổi UI.
- Ưu tiên giao diện rõ ràng, dễ thao tác, dễ đọc.
- Khi sửa form: chú ý validate, trạng thái disabled, loading, và thông báo lỗi.
- Khi sửa danh sách hoặc bảng: chú ý trạng thái rỗng, loading, và dữ liệu dài.
- Không thêm animation hoặc hiệu ứng chỉ để trang trí nếu không mang lại giá trị rõ ràng.
- Nội dung hiển thị nên phù hợp ngữ cảnh Việt Nam của dự án nhà hàng.

## Những gì không được tự ý làm
- Không tự ý đổi contract API.
- Không tự ý đổi cấu trúc thư mục lớn.
- Không tự ý thay framework hoặc thư viện UI chính.
- Không tự ý thêm package nếu chưa thật cần.
- Không tự ý đổi cấu hình môi trường development/production.
- Không tự ý thay đổi diện rộng về style chỉ vì thấy chưa đẹp.

## Khi hoàn thành
Luôn báo rõ:
- đã sửa file nào
- sửa gì
- lý do sửa
- có ảnh hưởng API, dữ liệu, hoặc hành vi giao diện hay không
- có cần kiểm tra lại với `server/` hay không
- cần kiểm tra thêm gì sau khi sửa
