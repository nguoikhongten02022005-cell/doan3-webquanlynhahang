# Quản lý nhà hàng

Phần giao diện chạy ở thư mục gốc. Phần máy chủ chuẩn dùng cho phát triển và kiểm thử hiện tại nằm trong `server/`.

## Cấu trúc chính

- `src/`: giao diện React + Vite
- `server/`: máy chủ chuẩn đang dùng thật
- `backend/`: bản cũ để tham khảo lịch sử, không nên dùng cho luồng chính nếu không có lý do rất cụ thể

## Chạy dự án

> Không dùng `backend/` để chạy ứng dụng hằng ngày trừ khi bạn đang kiểm tra lại phần mã cũ một cách có chủ đích.

### Giao diện

Tại root:

```bash
npm install
npm run dev
```

Cần cấu hình tối thiểu:

```env
VITE_USE_BACKEND=true
VITE_API_BASE_URL=http://localhost:4000/api
```

### Máy chủ

Trong `server/`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Hoặc từ root:

```bash
npm run dev:backend
```

## Nguồn đối chiếu chính

Khi đối chiếu giao diện với máy chủ, luôn bám theo `server/`:

- Lược đồ đơn hàng: `server/src/modules/orders/order.schema.ts`
- Xử lý nghiệp vụ đơn hàng: `server/src/modules/orders/orders.service.ts`
- Bộ chuyển dữ liệu phản hồi đơn hàng: `server/src/modules/orders/order.mapper.ts`
- Làm mới xác thực: `server/src/modules/auth/auth.route.ts`, `server/src/modules/auth/auth.controller.ts`

## Lưu ý vận hành

- Phần thanh toán ở giao diện chỉ gửi dữ liệu đơn hàng đúng với lược đồ từ máy chủ; máy chủ là nơi tính tiền cuối cùng.
- Luồng làm mới xác thực dùng `/auth/refresh` với cookie HTTP-only từ `server/`.
- Trạng thái và tiến trình đơn hàng ở giao diện bám trực tiếp theo enum từ máy chủ, không tự phân tích chuỗi văn bản.
- `backend/` là phần mã cũ: chỉ để tham khảo lịch sử, không phải máy chủ chuẩn để chạy ứng dụng hằng ngày.
- Nếu dùng Postman cho luồng hiện tại, hãy ưu tiên các tệp trong `server/postman/`.
