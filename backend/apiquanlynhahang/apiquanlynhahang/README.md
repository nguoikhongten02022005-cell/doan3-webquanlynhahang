# API Quan Ly Nha Hang - Backend C#

## Muc dich
Day la backend ASP.NET Core Web API cho du an quan ly nha hang trong thu muc `backend/apiquanlynhahang/apiquanlynhahang`.

Backend nay hien da co:
- ket noi MySQL
- Swagger de test API
- API cho mon an, ban an, dat ban, don hang, ma giam gia, nguoi dung
- auth co dang ky, dang nhap va JWT Bearer
- CORS local de frontend Vite co the goi truc tiep

## Cong nghe
- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- Pomelo MySQL Provider
- MySQL
- Swagger
- BCrypt
- JWT Bearer Authentication

## Database
- Ten database: `doan3quanlynhahang`
- File khoi tao schema va du lieu mau:
  - `Data/mysql_init_doan3quanlynhahang.sql`

## Cach chay
1. Dam bao MySQL dang chay va da import schema.
2. Kiem tra chuoi ket noi trong `appsettings.json`.
3. Chay lenh:

```bash
dotnet restore
dotnet build
dotnet run
```

## Dia chi local
- HTTP: `http://localhost:5011`
- HTTPS: `https://localhost:7038`
- Swagger: `https://localhost:7038/swagger`

## Ket noi frontend local
- Frontend Vite hien dang duoc cau hinh trong `.env` voi `VITE_API_BASE_URL=http://localhost:5011/api`
- Backend C# da mo CORS cho cac origin local pho bien nhu `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:5174`, `http://127.0.0.1:5174`
- Trong Development, backend khong ep redirect sang HTTPS de frontend local goi qua HTTP de hon
- Neu can doi origin duoc phep, them vao `Cors:AllowedOrigins` trong cau hinh moi truong

## JWT
Backend dung JWT Bearer.

Can cau hinh secret on dinh de token khong bi doi sau moi lan restart:

```powershell
setx Jwt__Secret "mot-chuoi-bi-mat-rat-dai-it-nhat-32-ky-tu"
```

Neu khong set `Jwt__Secret`, moi truong Development se tu sinh secret tam de chay local.

## Cach dung token tren Swagger
1. Dang ky hoac dang nhap qua `api/auth/register` hoac `api/auth/login`
2. Copy `accessToken`
3. Bam `Authorize` tren Swagger
4. Nhap:

```text
Bearer <accessToken>
```

## Nhom API hien co
- `api/auth`
- `api/mon-an`
- `api/ban-an`
- `api/dat-ban`
- `api/don-hang`
- `api/ma-giam-gia`
- `api/nguoi-dung`

## Phan quyen hien tai
- `customer`: dang ky, dang nhap, xem ho so cua minh, xem lich su dat ban, xem don hang cua minh
- `staff`: dang nhap noi bo, xem va xu ly ban/dat ban/don hang theo cac route da bao ve
- `admin`: toan quyen tren cac route quan tri va ma giam gia

## Luu y
- Mot so route da duoc bao ve bang JWT va role.
- `refresh token` chua hoan chinh nhu phien ban production.
- Backend nay la backend C# chinh dang duoc dung cho du an trong hien trang hien tai.

## Thu muc quan trong
- `Controllers/`: dinh nghia endpoint
- `Services/`: nghiep vu chinh
- `Repositories/`: truy cap du lieu cho mot so module
- `Models/`: map bang MySQL
- `DTOs/`: input/output model
- `Data/`: `DbContext` va file SQL seed
- `Middleware/`: xu ly loi toan cuc
- `Options/`: cau hinh JWT

## Kiem tra nhanh sau khi chay
- Mo `https://localhost:7038/swagger`
- Test `GET /api/mon-an`
- Dang ky user moi qua `POST /api/auth/register`
- Dang nhap qua `POST /api/auth/login`
- Dung token de test `GET /api/auth/me`
