# Hệ thống quản lý nhà hàng

Repo này là đồ án full-stack cho bài toán quản lý nhà hàng, gồm:

- **frontend** React + Vite trong `frontend/`
- **backend chính** NestJS + TypeScript trong `backend/nest-api/`
- **cơ sở dữ liệu** MySQL, script khởi tạo trong `database/`

Mục tiêu hiện tại của repo là chạy ổn các nghiệp vụ lõi của nhà hàng và giữ contract frontend - backend nhất quán để demo, kiểm thử và nộp đồ án.

## Phạm vi đã triển khai

### Khu vực khách hàng
- xem trang chủ, giới thiệu, thực đơn
- đăng ký, đăng nhập
- đặt bàn
- giỏ hàng, thanh toán
- theo dõi hồ sơ cá nhân
- xem lịch sử đơn hàng và lịch sử đặt bàn
- đánh giá sau đơn hàng đủ điều kiện
- flow gọi món tại bàn qua QR
- flow mang về: chọn món, giỏ hàng, thanh toán, theo dõi đơn

### Khu vực nội bộ
- đăng nhập nội bộ
- dashboard vận hành
- quản lý đặt bàn
- sơ đồ bàn và quản lý bàn
- quản lý đơn hàng tại chỗ
- quản lý đơn mang về
- duyệt đánh giá
- quản lý món ăn
- quản lý tài khoản nhân viên / quản trị
- thống kê doanh thu ở mức màn hình nội bộ cơ bản

## Phạm vi chưa nên mô tả quá tay

Các phần dưới đây **không nên xem là đã hoàn thiện end-to-end toàn hệ thống** nếu chưa mở rộng thêm:

- quản lý kho / nguyên liệu
- báo cáo chuyên sâu nhiều chiều
- các luồng BI hoặc dashboard phân tích nâng cao

Có thể xem đây là **hướng mở rộng tiếp theo** của đồ án, không phải phần đã hoàn thiện đầy đủ trong repo hiện tại.

## Kiến trúc repo

```text
doan3-webquanlynhahang/
├── frontend/                    # Frontend React + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── README.md
│   └── nest-api/                # Backend NestJS chính đang dùng
│       ├── src/
│       ├── test/
│       ├── .env.example
│       └── package.json
├── database/                    # SQL schema / seed phục vụ local
├── docs/                        # Mô tả nghiệp vụ, ghi chú phân tích
├── scripts/                     # Script smoke test và tiện ích
├── package.json                 # Script điều phối ở root
└── README.md
```

## Stack sử dụng

### Frontend
- React 19
- Vite 5
- React Router
- Ant Design
- TanStack Query

### Backend
- NestJS 10
- TypeScript
- MySQL (`mysql2`)
- JWT
- Swagger

## Yêu cầu môi trường

- Node.js 18+
- npm
- MySQL 8.x hoặc bản tương thích

## Cài đặt

Cài dependencies theo từng phần:

```bash
npm install
npm --prefix frontend install
npm --prefix backend/nest-api install
```

## Cấu hình môi trường

### 1) Frontend: `frontend/.env`

Frontend đọc biến môi trường Vite từ thư mục `frontend/`.

```env
VITE_USE_BACKEND=true
VITE_API_BASE_URL=http://localhost:5011/api
```

### 2) Backend: `backend/nest-api/.env`

Tạo file từ mẫu:

```bash
cp backend/nest-api/.env.example backend/nest-api/.env
```

Ví dụ các biến quan trọng:

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

### 3) Root `.env` cho script smoke test

File `.env` ở root không dùng cho Vite runtime. Nó chủ yếu hữu ích cho script như `npm run smoke:api`.

Ví dụ:

```env
SMOKE_API_BASE_URL=http://localhost:5011/api
```

## Khởi tạo dữ liệu MySQL

Backend hiện **không tự tạo schema**. Biến `DB_AUTO_INIT=true` chỉ phục vụ kiểm tra kết nối khi boot, không thay thế bước import SQL.

Vì vậy, trước khi chạy backend với database trống, hãy import script:

- `database/mysql_init_quannhahang.sql`

## Chạy dự án

### Chạy frontend

```bash
npm run dev
```

Hoặc chạy trực tiếp trong thư mục frontend:

```bash
npm --prefix frontend run dev
```

### Chạy backend

```bash
npm run dev:backend
```

Hoặc:

```bash
npm --prefix backend/nest-api run start:dev
```

## Các lệnh thường dùng

### Root scripts

```bash
npm run dev               # chạy frontend
npm run dev:frontend      # chạy frontend
npm run dev:backend       # chạy backend NestJS
npm run build             # build frontend
npm run build:frontend    # build frontend
npm run build:backend     # build backend
npm run lint              # lint frontend
npm run lint:backend      # lint backend
npm run test              # test frontend
npm run test:backend      # unit test backend
npm run smoke:api         # smoke test API qua biến SMOKE_API_BASE_URL
```

### Backend riêng

```bash
npm --prefix backend/nest-api run start:dev
npm --prefix backend/nest-api run build
npm --prefix backend/nest-api run test
npm --prefix backend/nest-api run test:e2e
```

## Các nhóm API chính đang dùng

Backend hiện phục vụ các nhóm route có prefix `/api`:

- `/api/auth`
- `/api/nguoi-dung`
- `/api/thuc-don`
- `/api/ban`
- `/api/dat-ban`
- `/api/don-hang`
- `/api/ma-giam-gia/validate`
- `/api/danh-gia`
- `/api/mang-ve`
- `/api/diem-tich-luy`

Swagger UI mặc định tại:

- `http://localhost:5011/swagger`

## Ghi chú triển khai quan trọng

- Frontend đang gọi API theo base URL kiểu `http://localhost:5011/api`, vì vậy backend phải giữ nguyên prefix `/api` ở các controller.
- Các route lõi như auth, bàn, đặt bàn, thực đơn, đơn hàng, đánh giá và mang về đã được nối thật với backend NestJS.
- Repo ưu tiên giữ kiến trúc hiện tại, tránh refactor lớn không cần thiết.

## Tài liệu liên quan

- `docs/MO_TA_NGHIEP_VU.md`
- `docs/ma-tran-phan-quyen-api.md`
- `backend/README.md`
- `backend/nest-api/README.md`
- `database/mysql_init_quannhahang.sql`
