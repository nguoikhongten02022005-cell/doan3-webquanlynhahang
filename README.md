# Quản lý nhà hàng

Frontend chạy ở thư mục root, backend chuẩn nằm trong `server/`.

## Cấu trúc chính

- `src/`: frontend React + Vite
- `server/`: backend canonical đang dùng thật
- `backend/`: bản cũ/legacy, không nên dùng cho flow chính nếu không có lý do rất cụ thể

## Chạy dự án

### Frontend

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

### Backend

Trong `server/`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Contract nguồn sự thật

Khi đối chiếu FE ↔ BE, luôn bám `server/`:

- Order DTO: `server/src/modules/orders/order.schema.ts`
- Order business logic: `server/src/modules/orders/orders.service.ts`
- Order response mapper: `server/src/modules/orders/order.mapper.ts`
- Auth refresh: `server/src/modules/auth/auth.route.ts`, `server/src/modules/auth/auth.controller.ts`

## Lưu ý vận hành

- FE checkout chỉ gửi payload order đúng DTO backend; backend là nơi tính tiền cuối cùng.
- Refresh token flow dùng `/auth/refresh` với cookie HTTP-only từ backend `server/`.
- Status/order timeline ở FE map trực tiếp từ enum backend, không parse text tự do.
- `backend/` hiện nên xem là legacy/stale để tham khảo, không phải backend chuẩn để chạy app hằng ngày.
