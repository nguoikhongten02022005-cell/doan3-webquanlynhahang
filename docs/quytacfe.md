# QUY_TAC_FE

## 1. Mục tiêu
Phần frontend của project này được viết bằng React.

Mục tiêu:
- Xây dựng giao diện quản lý nhà hàng
- Giao diện rõ ràng, dễ nhìn, dễ dùng
- Phù hợp đồ án sinh viên
- Phù hợp ngữ cảnh tại Việt Nam
- Dễ kết nối với backend C# + ASP.NET Core Web API + MySQL sau này

---

## 2. Công nghệ sử dụng
- React
- JavaScript
- CSS
- React Router

Lưu ý:
- Không tự ý đổi sang công nghệ khác nếu chưa có yêu cầu
- Không tự ý thêm thư viện phức tạp nếu không cần thiết
- Không tự ý đổi toàn bộ project sang TypeScript nếu chưa được yêu cầu
- Không tự ý thêm quá nhiều package chỉ để làm giao diện đẹp hơn

---

## 3. Quy tắc ngôn ngữ trong code
- Ưu tiên viết code bằng tiếng Việt không dấu
- Không tự ý đặt tên biến, tên hàm, tên component bằng tiếng Anh nếu có thể dùng tiếng Việt không dấu
- Chỉ giữ tiếng Anh ở những phần bắt buộc của framework hoặc thư viện, ví dụ:
  - `useState`
  - `useEffect`
  - `useMemo`
  - `useCallback`
  - `BrowserRouter`
  - `Route`
  - `Routes`
  - `Link`
  - `Navigate`
  - `import`
  - `export default`
  - `return`
- Tên file component, tên biến, tên dữ liệu, tên hàm xử lý nên ưu tiên tiếng Việt không dấu
- Nội dung hiển thị ra giao diện phải là tiếng Việt tự nhiên, dễ hiểu

Ví dụ nên dùng:
- `TrangChu`
- `TrangDangNhap`
- `TrangThucDon`
- `DanhSachMonAn`
- `NutDatBan`
- `duLieuMonAn`
- `xuLyDangNhap`
- `taiDanhSachMon`
- `gioHang`
- `tongTien`

Không nên lạm dụng:
- `TrangChuPage`
- `DangNhapPage`
- `ThucDonPage`
- `handleSubmit`
- `fetchData`
- `userInfo`
- `cartData`

---

## 4. Quy tắc giao diện
- Giao diện không được làm theo kiểu AI chung chung
- Không làm giao diện rập khuôn, bóng bẩy quá mức, thiếu thực tế
- Giao diện phải rõ chức năng, có bố cục hợp lý, dễ thao tác
- Giao diện phải phù hợp với nhà hàng tại Việt Nam
- Không dùng nội dung, hình ảnh, biểu tượng hoặc cách trình bày mang nặng phong cách nước ngoài nếu không cần thiết
- Không làm giao diện quá màu mè gây rối mắt
- Ưu tiên giao diện sạch, dễ hiểu, thực tế, đúng đồ án
- Các nút bấm phải rõ chức năng
- Các form nhập liệu phải rõ nhãn
- Danh sách món ăn, giỏ hàng, bàn ăn, hóa đơn phải dễ theo dõi
- Không dùng quá nhiều hiệu ứng chuyển động gây nặng giao diện
- Không dùng quá nhiều popup nếu không cần thiết

Yêu cầu thêm:
- Có trạng thái loading
- Có trạng thái rỗng
- Có thông báo lỗi cơ bản
- Có thông báo thành công khi thao tác quan trọng
- Có thông báo xác nhận với thao tác xóa hoặc thay đổi dữ liệu quan trọng

---

## 5. Quy tắc ngữ cảnh Việt Nam
Toàn bộ nội dung hiển thị phải phù hợp với môi trường Việt Nam.

Bao gồm:
- Tên món ăn Việt Nam
- Tên người Việt Nam
- Địa chỉ Việt Nam
- Số điện thoại Việt Nam
- Tiền tệ Việt Nam đồng
- Cách dùng từ phù hợp nhà hàng tại Việt Nam
- Cách trình bày nghiệp vụ đúng với mô hình nhà hàng, quán ăn, quán nước tại Việt Nam

Ví dụ dữ liệu đúng:
- Phở bò
- Cơm tấm
- Bún chả
- Trà đá
- Cà phê sữa đá
- Nguyễn Văn A
- Trần Thị B
- 0901234567
- Hà Nội
- Thành phố Hồ Chí Minh
- Đà Nẵng

Không dùng mặc định dữ liệu kiểu:
- John
- Anna
- New York
- Burger
- Pizza kiểu ví dụ mặc định nếu không có yêu cầu

---

## 6. Quy tắc tổ chức file
Không được viết code dồn toàn bộ vào một file.

Phải tách rõ ràng theo từng vai trò.

Cấu trúc đề xuất:

```text
src/
  thanh_phan/
  bo_cuc/
  trang/
  du_lieu/
  hooks/
  dich_vu/
  tien_ich/
  hinh_anh/
  dinh_tuyen/
  ngu_canh/
  hang_so/
  css/
```

---

## 7. Quy tắc tách file component
Mỗi component nên tách file riêng nếu component có giao diện hoặc logic riêng.

Ví dụ đúng:
- `thanh_phan/mon_an/TheMonAn.jsx`
- `thanh_phan/gio_hang/MucGioHang.jsx`
- `thanh_phan/dat_ban/BieuMauDatBan.jsx`
- `thanh_phan/dung_chung/ThongBaoRong.jsx`

Không nên:
- Nhét 5 đến 10 component lớn vào chung một file
- Viết một file quá dài khó đọc
- Gom cả logic, giao diện, dữ liệu mẫu, gọi API vào cùng một nơi

Quy tắc:
- Một file chỉ nên có một component chính
- Component con có thể tách riêng nếu dùng lại hoặc dài
- File quá dài thì phải tách nhỏ
- Component dùng nhiều nơi phải tách riêng để tái sử dụng
- Không tạo component quá nhỏ một cách vô nghĩa

---

## 8. Quy tắc tách trang
Mỗi trang phải có file riêng.

Ví dụ:
- `trang/TrangChu.jsx`
- `trang/TrangThucDon.jsx`
- `trang/TrangDangNhap.jsx`
- `trang/TrangDatBan.jsx`
- `trang/TrangGioHang.jsx`
- `trang/TrangThanhToan.jsx`
- `trang/TrangHoSo.jsx`
- `trang/noi_bo/TrangBangDieuKhienNoiBo.jsx`

Không được viết toàn bộ nhiều trang trong cùng một file.

Mỗi trang nên:
- Có mục đích rõ ràng
- Có tiêu đề rõ ràng
- Dễ đọc
- Không quá dài nếu có thể tách nhỏ

---

## 9. Quy tắc tách CSS
- Không dồn toàn bộ CSS vào một file duy nhất nếu project lớn
- CSS của phần nào nên gắn gần phần đó nếu hợp lý

Có thể dùng:
- File CSS riêng theo trang
- File CSS riêng theo component
- Hoặc nhóm CSS theo khu vực giao diện

Nếu đang có file CSS chung thì chỉ giữ cho:
- Reset cơ bản
- Màu chủ đạo
- Biến dùng chung
- Style nền tảng

Ví dụ:
- `trang/TrangThucDon.css`
- `thanh_phan/mon_an/TheMonAn.css`
- `css/bien_mau.css`
- `css/dung_chung.css`

Không nên:
- Viết toàn bộ style của cả project vào một file quá dài
- Để CSS lặp lại nhiều nơi
- Đặt tên class quá chung chung dễ đụng nhau

---

## 10. Quy tắc dữ liệu giả
Trong giai đoạn chưa nối backend thật:
- Được dùng dữ liệu giả
- Dữ liệu giả phải đặt ở thư mục riêng
- Không viết cứng dữ liệu lớn trực tiếp trong component
- Dữ liệu giả phải phù hợp ngữ cảnh Việt Nam

Ví dụ:
- `du_lieu/mon_an_mau.js`
- `du_lieu/ban_an_mau.js`
- `du_lieu/tai_khoan_mau.js`
- `du_lieu/dat_ban_mau.js`

Không nên:
- Để 20 đến 50 dòng dữ liệu mẫu ngay trong file component
- Dùng dữ liệu mẫu tiếng Anh nếu không cần
- Vừa viết dữ liệu giả vừa viết logic vừa viết giao diện trong cùng một file dài

---

## 11. Quy tắc gọi API
Khi bắt đầu nối backend:
- Tách riêng phần gọi API
- Không gọi API trực tiếp rải rác trong nhiều component nếu có thể gom lại
- Mỗi nhóm chức năng nên có file riêng
- Phần gọi API phải dễ sửa để sau này nối backend C# thuận tiện
- Tên hàm gọi API nên rõ nghĩa

Ví dụ:
- `dich_vu/api_mon_an.js`
- `dich_vu/api_dang_nhap.js`
- `dich_vu/api_don_hang.js`
- `dich_vu/api_dat_ban.js`

Quy tắc:
- Component chỉ nên gọi hàm dịch vụ, không nên tự viết fetch dài trong từng nơi
- Xử lý lỗi cơ bản phải có
- Không để route API viết lặp lại khắp nơi nếu có thể gom lại

---

## 12. Quy tắc đặt tên file
Ưu tiên tên file rõ nghĩa, dễ đọc, thống nhất.

Ví dụ nên dùng:
- `TrangThucDon.jsx`
- `TheMonAn.jsx`
- `BieuMauDatBan.jsx`
- `api_mon_an.js`
- `dinh_dang_tien_te.js`
- `useGioHang.js`

Không nên:
- `a.jsx`
- `test1.jsx`
- `newfile.jsx`
- `component.jsx`
- `abc.js`

Quy tắc:
- Tên file phải phản ánh đúng chức năng
- Không đặt tên mơ hồ
- Không đặt tên quá ngắn khó hiểu
- Tên file cùng nhóm nên theo cùng một kiểu đặt tên

---

## 13. Quy tắc logic frontend
- Logic đơn giản để trong component
- Logic dùng lại nhiều nơi thì tách ra hook hoặc tiện ích
- Không viết một hàm quá dài, quá nhiều nhánh xử lý
- Không lồng quá nhiều điều kiện khó đọc
- Ưu tiên code dễ hiểu, dễ sửa
- Phần xử lý dữ liệu nên tách khỏi phần hiển thị nếu file bắt đầu dài
- Không trộn quá nhiều trách nhiệm vào một component

Ví dụ:
- Xử lý giỏ hàng nên để ở hook hoặc context
- Định dạng tiền nên để ở `tien_ich/`
- Xử lý dữ liệu menu nên để ở `dich_vu/` hoặc `hooks/`

---

## 14. Quy tắc trải nghiệm người dùng
Frontend cần có tối thiểu:
- Trang chủ
- Trang thực đơn
- Trang đặt bàn
- Trang giỏ hàng
- Trang thanh toán
- Trang đăng nhập
- Trang đăng ký
- Trang hồ sơ
- Trang nội bộ quản lý nếu có

Mỗi trang nên có:
- Tiêu đề rõ ràng
- Nội dung chính rõ ràng
- Nút thao tác rõ ràng
- Thông báo khi lỗi hoặc không có dữ liệu
- Trạng thái loading nếu có tải dữ liệu

Form cần:
- Có nhãn rõ ràng
- Có kiểm tra dữ liệu cơ bản
- Có thông báo lỗi dễ hiểu
- Không dùng câu chữ cứng, khó hiểu

---

## 15. Quy tắc không được vi phạm
- Không viết code dồn vào một file lớn
- Không trộn dữ liệu mẫu, giao diện và gọi API vào một chỗ nếu file đã quá dài
- Không lạm dụng tiếng Anh trong phần tự đặt tên
- Không làm giao diện kiểu mẫu AI chung chung
- Không làm sai ngữ cảnh Việt Nam
- Không dùng dữ liệu mặc định kiểu nước ngoài nếu không có yêu cầu
- Không tự ý đổi cấu trúc project đang ổn thành cấu trúc rối hơn
- Không tự ý thêm thư viện nặng chỉ để xử lý việc nhỏ
- Không tạo file rác, file thử nghiệm lung tung trong project chính thức

---

## 16. Cách làm việc mong muốn
Khi chỉnh sửa frontend, phải làm theo thứ tự:
- Đọc cấu trúc hiện tại
- Xác định file nào cần giữ
- Xác định file nào cần tách nhỏ
- Đề xuất cách tổ chức lại nếu cần
- Sau đó mới sửa code

Khi tạo mới component hoặc trang, phải đặt đúng thư mục.

Phải báo lại rõ:
- Đã tạo file nào
- Đã sửa file nào

Nếu thay đổi lớn, phải giữ code dễ đọc và dễ kiểm tra.

---

## 17. Ưu tiên hiện tại
Ưu tiên các mục sau:
- Giao diện hoàn chỉnh, rõ ràng
- Tổ chức file chuẩn
- Tách file rõ ràng
- Dễ nối backend C#
- Dễ bảo trì
- Dễ đọc khi nộp đồ án
- Đúng yêu cầu đồ án tại Việt Nam
- Hạn chế sửa đi sửa lại nhiều lần

---

## 18. Ghi chú đặc biệt
- Frontend này viết bằng React
- Ưu tiên dùng tiếng Việt không dấu trong phần tự đặt tên
- Phải tách file rõ ràng
- Không viết dồn toàn bộ vào một file
- Giao diện phải tự nhiên, thực tế, không mang cảm giác sản phẩm AI tạo tự động
- Phải phù hợp với đồ án quản lý nhà hàng tại Việt Nam
- Các phần bắt buộc của framework có thể giữ tiếng Anh
- Chỉ dịch và Việt hóa những phần do lập trình viên tự đặt tên

---

## 19. Quy tắc debug
- Chỉ debug khi thật sự cần thiết
- Không được để lại code debug tạm trong bản chính thức
- Không được để lại `console.log`, `debugger`, dữ liệu test tạm hoặc đoạn kiểm tra thủ công sau khi sửa xong
- Không được tạo file log rác, file tạm, file test tạm trong project nếu không cần
- Nếu công cụ sinh ra thư mục log hoặc file log tạm như `.playwright-mcp`, `.log`, file debug test, thì phải dọn sạch sau khi dùng xong
- Không commit file log, file tạm, file cache, file debug lên GitHub
- Các thư mục hoặc file phục vụ debug tạm phải được thêm vào `.gitignore` nếu cần
- Khi debug, không được làm thay đổi cấu trúc chính của project nếu không có lý do rõ ràng
- Không được sửa bừa trực tiếp nhiều file chỉ để thử lỗi
- Nếu cần debug giao diện, ưu tiên sửa đúng file liên quan, sửa gọn, dễ kiểm soát

Sau khi debug xong phải:
- Xóa code debug tạm
- Xóa file log tạm
- Kiểm tra lại giao diện
- Kiểm tra lại luồng chạy chính
- Chỉ giữ lại code sạch, dễ đọc

Quy định thêm:
- Không dùng debug làm code rối hơn
- Không để lại dấu vết debug trong bản nộp đồ án
- Bản cuối cùng phải sạch, gọn, không có file rác

---

## 20. Quy tắc chất lượng mã nguồn
- Code phải dễ đọc
- Code phải dễ hiểu với sinh viên và giảng viên khi xem
- Không viết quá nhiều mẹo kỹ thuật khó hiểu
- Ưu tiên sự rõ ràng hơn là phức tạp
- Mỗi file phải có mục đích rõ ràng
- Nếu một file quá dài thì phải tách bớt
- Không để hàm quá dài nếu có thể chia nhỏ
- Không lặp code nếu có thể tái sử dụng

---

## 21. Quy tắc chuẩn bị kết nối backend
Frontend phải được viết sao cho dễ kết nối với backend C# + MySQL sau này.

Yêu cầu:
- Tách phần gọi API ra riêng
- Tên dữ liệu rõ ràng
- Tránh phụ thuộc vào dữ liệu giả quá sâu
- Có thể thay dữ liệu giả bằng dữ liệu thật mà ít phải sửa giao diện
- Không viết logic quá cứng vào component

Ưu tiên:
- Danh sách món ăn
- Đăng nhập
- Đăng ký
- Giỏ hàng
- Đặt hàng
- Đặt bàn
- Hồ sơ người dùng
- Trang nội bộ quản lý

---

## 22. Quy tắc dọn dẹp project
- Xóa file rác, file thừa, file thử nghiệm không còn dùng
- Không giữ các thư mục log tạm như `.playwright-mcp` nếu không còn cần
- Không giữ file test tạm, file ghi chú tạm trong `src/`
- Không giữ hình ảnh mẫu không dùng
- Không để project lộn xộn trước khi nộp

---

## 23. Quy tắc phản hồi khi chỉnh sửa code
Khi thực hiện chỉnh sửa frontend, cần phản hồi rõ:
- Đã sửa file nào
- Đã tạo file nào
- Đã xóa file nào
- Mục đích của từng thay đổi
- Có ảnh hưởng đến route, giao diện hoặc logic nào không

Nếu có chỗ chưa chắc chắn:
- Phải ghi rõ
- Không tự ý sửa mạnh tay
- Ưu tiên an toàn và dễ kiểm tra

---

## 24. Kết luận áp dụng
Toàn bộ frontend phải đi theo các nguyên tắc sau:
- Viết bằng React
- Ưu tiên tiếng Việt không dấu trong phần tự đặt tên
- Tách file rõ ràng
- Không viết dồn vào một file
- Giao diện thực tế, không kiểu AI
- Đúng ngữ cảnh Việt Nam
- Dễ nối backend C#
- Sạch, dễ đọc, dễ bảo trì, phù hợp đồ án sinh viên
