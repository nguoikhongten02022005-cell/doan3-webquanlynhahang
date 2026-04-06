# Backend NestJS + MySQL

## Muc dich

Thu muc `backend/nest-api` la backend TypeScript + NestJS moi de thay the backend C# trong repo, uu tien chay tot tren Linux.

Backend nay dang bam contract ma frontend hien tai su dung:

- `api/auth`
- `api/nguoi-dung`
- `api/thuc-don`
- `api/ban`
- `api/dat-ban`
- `api/don-hang`
- `api/ma-giam-gia/validate`
- `api/danh-gia`
- `api/mang-ve/*`

## Cong nghe

- NestJS
- TypeScript
- MySQL qua `mysql2`
- JWT qua `jsonwebtoken`
- BCrypt qua `bcryptjs`

## Cau hinh moi truong

Tao file `.env` trong `backend/nest-api` tu `.env.example`.

Neu muon backend tu tao bang va seed du lieu mau khi chay lan dau, giu `DB_AUTO_INIT=true`.

Tai khoan seed mac dinh:

- `admin@nhahang.com` / `Admin@123`
- `an.nv@nhahang.com` / `Staff@123`
- `khach@nhahang.com` / `Khach@123`

## Cach chay tren Linux

```bash
npm install
npm run dev:backend
```

Hoac:

```bash
cd backend/nest-api
npm install
npm run start:dev
```

## Build

```bash
npm run build:backend
```

## Luu y Linux

- Khong phu thuoc Visual Studio hay `.sln`
- Khong phu thuoc IIS Express
- Can MySQL local co user/password dung voi file `.env`
- Cong mac dinh giu `5011` de frontend khong can doi `VITE_API_BASE_URL`

## Tinh trang hien tai

- Da build thanh cong tren Linux
- Da co route de frontend hien tai goi sang
- Chua the smoke test toi DB that trong may nay vi thong tin MySQL hien tai chua dang nhap duoc
