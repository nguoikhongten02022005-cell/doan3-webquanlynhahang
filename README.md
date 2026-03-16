# Hệ thống Quản lý Nhà hàng & Vận hành dịch vụ (Restaurant Management System)

## Mô tả bài toán

Xây dựng hệ thống quản lý nhà hàng toàn diện, hỗ trợ theo dõi và vận hành các hoạt động chính như quản lý khách hàng, đặt bàn, bàn ăn, thực đơn, đơn hàng, voucher, kho nguyên liệu, báo cáo thống kê và gọi món qua QR theo bàn. Hệ thống giúp số hóa quy trình phục vụ, tăng hiệu quả quản lý và nâng cao trải nghiệm khách hàng trong quá trình sử dụng dịch vụ tại nhà hàng.

Với nhu cầu ngày càng cao về tốc độ phục vụ, tính chính xác trong quản lý đơn hàng và khả năng kiểm soát vận hành nội bộ, hệ thống này kết nối các bộ phận trong nhà hàng thành một luồng xử lý thống nhất. Từ khách hàng đặt bàn, gọi món, đến nhân viên tiếp nhận và xử lý đơn, quản trị viên theo dõi doanh thu, tồn kho và hiệu quả hoạt động, tất cả đều được quản lý trên cùng một nền tảng web tập trung.

Hệ thống cung cấp giao diện web thân thiện, dễ sử dụng cho từng vai trò, hỗ trợ quản lý vận hành theo thời gian thực và tạo nền tảng để mở rộng thêm các chức năng chuyên sâu trong tương lai.

## Các vai trò

### Admin

- quản lý người dùng
- quản lý phân quyền
- theo dõi báo cáo, thống kê, doanh thu
- quản lý kho, nguyên liệu, cấu hình hệ thống

### Staff

- tiếp nhận và xử lý đặt bàn
- gán bàn cho khách
- quản lý trạng thái bàn
- xử lý đơn hàng
- hỗ trợ kiểm tra voucher và theo dõi vận hành hằng ngày

### Customer

- đăng ký, đăng nhập
- đặt bàn trực tuyến
- xem thực đơn
- tạo đơn hàng
- áp dụng voucher
- theo dõi lịch sử đặt bàn và đơn hàng

### Khách quét QR tại bàn

- xem thực đơn theo bàn
- gọi món trực tiếp bằng mã QR
- tạo đơn hàng gắn với bàn tương ứng

## Chức năng chính

### Quản lý tài khoản và phân quyền

- đăng ký, đăng nhập, đăng xuất
- phân quyền theo `customer`, `staff`, `admin`
- quản lý hồ sơ cá nhân

### Quản lý đặt bàn

- tạo booking trực tuyến
- quản lý nhiều trạng thái đặt bàn
- theo dõi lịch sử đặt bàn
- gán bàn theo khu vực, sức chứa và tình trạng thực tế

### Quản lý bàn ăn và khu vực bàn

- quản lý danh sách bàn
- quản lý khu vực bàn
- theo dõi trạng thái bàn: trống, giữ chỗ, đang phục vụ, cần dọn

### Quản lý thực đơn

- hiển thị danh sách món ăn
- phân loại món theo danh mục
- cập nhật trạng thái món còn phục vụ hoặc tạm hết

### Quản lý đơn hàng

- tạo đơn hàng từ khách hàng hoặc nội bộ
- quản lý chi tiết món trong đơn
- cập nhật trạng thái xử lý đơn hàng
- liên kết đơn hàng với bàn ăn

### Quản lý voucher

- kiểm tra mã giảm giá
- áp dụng voucher cho đơn hàng
- kiểm soát điều kiện sử dụng, giá trị tối thiểu, số lượt dùng

### Báo cáo thống kê

- thống kê doanh thu theo ngày, tuần, tháng
- thống kê số lượng đơn hàng và booking
- thống kê trạng thái bàn và trạng thái booking
- thống kê voucher đã sử dụng
- top món bán chạy

### Quản lý kho nguyên liệu

- quản lý nguyên liệu
- theo dõi tồn kho
- quản lý nhập kho
- cấu hình định lượng nguyên liệu theo món
- cảnh báo nguyên liệu sắp hết

### QR gọi món theo bàn

- mỗi bàn có mã QR riêng
- quét QR để mở menu theo bàn
- gọi món trực tiếp từ điện thoại
- tạo đơn hàng gắn đúng với bàn

## Kiến trúc hệ thống

```text
┌─────────────────┐    ┌──────────────────────────────┐    ┌──────────────────────────┐
│   React App     │    │  ASP.NET Core Web API        │    │     Business Modules     │
│   (Frontend)    │◄──►│  JWT Authentication          │◄──►│                          │
└─────────────────┘    └──────────────────────────────┘    │ • Auth                   │
                                                           │ • Users                  │
                                                           │ • Bookings               │
                                                           │ • Tables                 │
                                                           │ • Menu Items             │
                                                           │ • Orders                 │
                                                           │ • Vouchers               │
                                                           │ • Reports                │
                                                           │ • Inventory              │
                                                           │ • QR Ordering            │
                                                           └──────────────────────────┘
```

## Công nghệ sử dụng

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT
- Swagger

### Frontend

- React
- Vite
- React Router

## Cấu trúc dự án

```text
doan3-webquanlynhahang/
├── src/                                      # Frontend React + Vite
├── backend/
│   └── apiquanlynhahang/
│       └── apiquanlynhahang/                 # Backend C# chính dùng cho bài
├── server/                                   # Mã backend khác để tham khảo
└── README.md
```

## Chạy dự án

### Chạy frontend

Tại thư mục gốc:

```bash
npm install
npm run dev
```

Cấu hình tối thiểu trong `.env`:

```env
VITE_USE_BACKEND=true
VITE_API_BASE_URL=http://localhost:5011/api
```

### Chạy backend C#

Trong thư mục `backend/apiquanlynhahang/apiquanlynhahang/`:

```bash
dotnet restore
dotnet build
dotnet run
```

Địa chỉ local thường dùng:

- API HTTP: `http://localhost:5011`
- Swagger: `http://localhost:5011/swagger`

## Ghi chú

- Backend C# + MySQL là phần đang dùng để phát triển và demo bài.
- `server/` không phải luồng backend chính trong hiện trạng bài này.
- Nếu frontend gọi API local, cần đảm bảo backend C# đang chạy đúng cổng và CORS được cấu hình phù hợp.
