# Restaurant Management Server

Backend production-oriented cho dự án web quản lý nhà hàng.

## Stack
- Node.js
- TypeScript
- Express
- MySQL
- Prisma

## Cấu trúc chính
- `src/app.ts`: bootstrap Express
- `src/server.ts`: start server + graceful shutdown
- `src/routes/index.ts`: mount `/api` và `/api/v1`
- `src/modules/*`: domain modules
- `prisma/schema.prisma`: schema MySQL/Prisma
- `prisma/seed.ts`: seed dữ liệu mẫu

## Chuẩn route
- Compatibility: `/api/...`
- Versioned: `/api/v1/...`
- Docs: `/api-docs`

## Biến môi trường
Copy `.env.example` thành `.env`.

## Cài đặt
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

## Tài khoản seed
- Admin: `admin` / `admin123`
- Staff: `staff` / `staff123`
- Customer: `customer@example.com` / `customer123`

## Endpoint chính
### Auth
- `POST /api/auth/login`
- `POST /api/auth/internal-login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Public/customer
- `GET /api/menu-items`
- `POST /api/bookings`
- `GET /api/bookings/history`
- `POST /api/orders`
- `POST /api/orders/checkout`
- `GET /api/orders/me`
- `GET /api/vouchers/:code`
- `POST /api/vouchers/validate`

### Internal
- `GET /api/v1/internal/dashboard/stats`
- `GET /api/v1/internal/users`
- `GET /api/v1/internal/bookings`
- `GET /api/v1/internal/tables`
- `GET /api/v1/internal/orders`
- `GET /api/v1/internal/vouchers`
- `GET /api/v1/internal/menu`

## Ghi chú tương thích frontend
Backend giữ contract cho frontend hiện tại:
- auth response có `accessToken`, `user`, `currentUser`
- lỗi giữ field `message`
- booking history vẫn trả item đã map cho ProfilePage
- menu trả `price` dạng chuỗi VND qua mapper
