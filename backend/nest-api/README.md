# Backend NestJS + MySQL

`backend/nest-api/` là backend chính đang được frontend của repo này sử dụng.

Mục tiêu của phần backend là cung cấp API cho các nghiệp vụ lõi của hệ thống quản lý nhà hàng, giữ contract ổn định để frontend trong `frontend/` gọi trực tiếp qua base URL `/api`.

## Các nhóm API đang có

- `api/auth`
- `api/nguoi-dung`
- `api/thuc-don`
- `api/ban`
- `api/dat-ban`
- `api/don-hang`
- `api/ma-giam-gia/validate`
- `api/danh-gia`
- `api/mang-ve`
- `api/loyalty`
- static file upload tại `/uploads`

## Công nghệ

- NestJS
- TypeScript
- MySQL qua `mysql2`
- JWT qua `jsonwebtoken`
- BCrypt qua `bcryptjs`
- Swagger

## Cấu hình môi trường

Tạo file `.env` trong `backend/nest-api` từ file mẫu:

```bash
cp backend/nest-api/.env.example backend/nest-api/.env
```

Biến môi trường chính:

```env
PORT=5011
FRONTEND_ORIGIN=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=QuanNhaHang
DB_AUTO_INIT=false
JWT_SECRET=mot-chuoi-bi-mat-rat-dai-it-nhat-32-ky-tu
JWT_ISSUER=nest-api-quan-ly-nha-hang
JWT_AUDIENCE=quan-ly-nha-hang-frontend
JWT_EXPIRES_IN=12h
```

## Dữ liệu mẫu và schema

Backend hiện không tự dựng schema. Trước khi chạy với database trống, hãy import script:

- `database/mysql_init_quannhahang.sql`

Lưu ý:
- `DB_AUTO_INIT=true` hiện chỉ kiểm tra kết nối MySQL khi khởi động
- biến này **không** tự tạo bảng hoặc seed dữ liệu cho database mới

## Chạy backend

Từ thư mục gốc repo:

```bash
npm run dev:backend
```

Hoặc chạy trực tiếp:

```bash
cd backend/nest-api
npm install
npm run start:dev
```

## Build và test

```bash
npm run build
npm run test
npm run test:e2e
```

Nếu chạy từ root repo:

```bash
npm run build:backend
npm run test:backend
npm --prefix backend/nest-api run test:e2e
```

## Swagger

Sau khi backend chạy local, Swagger UI có tại:

- `http://localhost:5011/swagger`

## Trạng thái hiện tại

Backend đã nối các nghiệp vụ chính mà frontend đang dùng:

- xác thực khách hàng và nội bộ
- quản lý người dùng nội bộ
- thực đơn
- bàn ăn và QR bàn
- đặt bàn
- đơn hàng tại chỗ
- đơn mang về
- voucher / mã giảm giá
- đánh giá
- loyalty cơ bản

Các phần như báo cáo sâu hoặc quản lý kho/nguyên liệu không nên mô tả là đã hoàn thiện end-to-end nếu chưa được phát triển thêm ngoài phạm vi hiện tại.

## Ghi chú tương thích với frontend

- Frontend đang gọi path kiểu `/auth`, `/ban`, `/don-hang`... trên base URL có sẵn `/api`
- vì vậy backend cần giữ controller theo dạng `@Controller('api/...')`
- cổng mặc định là `5011` để khớp cấu hình local phổ biến của frontend
