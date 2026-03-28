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
- Schema local duoc tao theo EF Core migration trong thu muc `Migrations/`
- Du lieu mau local duoc seed tu code trong Development
- File `Data/mysql_init_doan3quanlynhahang.sql` la artifact cu, khong con la nguon chuan de bootstrap schema backend hien tai

## Cach chay
1. Dam bao MySQL dang chay.
2. Kiem tra chuoi ket noi trong `appsettings.json`.
3. Khi chay local Development, backend se tu dong apply migration va seed du lieu mau toi thieu.
4. Chay lenh:

```bash
dotnet restore
dotnet build
dotnet run
```

## Ghi chu ve schema local
Schema local hien tai duoc quan ly bang EF Core migration va du lieu mau duoc seed bang code khi chay trong Development.

```text
Migrations/
Data/DuLieuPhatTrienKhoiTao.cs
```

Neu can reset local, hay xoa DB `doan3quanlynhahang` roi chay lai backend de migration + seed duoc ap dung lai.

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

## Danh sach API chinh

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/internal-login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/me`

### Nguoi dung
- `GET /api/nguoi-dung`
- `GET /api/nguoi-dung/{id}`
- `PATCH /api/nguoi-dung/{id}`

### Mon an
- `GET /api/mon-an`
- `GET /api/mon-an/{id}`
- `POST /api/mon-an`
- `PUT /api/mon-an/{id}`
- `DELETE /api/mon-an/{id}`

### Ban an
- `GET /api/ban-an`
- `GET /api/ban-an/{id}`
- `POST /api/ban-an`
- `PUT /api/ban-an/{id}`
- `PATCH /api/ban-an/{id}/trang-thai`

### Bao cao
- `GET /api/bao-cao/tong-quan`
- `GET /api/bao-cao/top-mon-ban-chay`
- `GET /api/bao-cao/canh-bao-kho`

### Dat ban
- `POST /api/dat-ban`
- `GET /api/dat-ban`
- `GET /api/dat-ban/{id}`
- `GET /api/dat-ban/history`
- `PATCH /api/dat-ban/{id}`
- `PATCH /api/dat-ban/{id}/status`
- `PATCH /api/dat-ban/{id}/assign-tables`
- `PATCH /api/dat-ban/{id}/cancel`

### Don hang
- `POST /api/don-hang`
- `GET /api/don-hang`
- `GET /api/don-hang/{id}`
- `GET /api/don-hang/me`
- `PATCH /api/don-hang/{id}/status`

### Ma giam gia
- `GET /api/ma-giam-gia`
- `GET /api/ma-giam-gia/{code}`
- `POST /api/ma-giam-gia`
- `POST /api/ma-giam-gia/validate`
- `PUT /api/ma-giam-gia/{id}`
- `DELETE /api/ma-giam-gia/{id}`

### Kho nguyen lieu
- `GET /api/nguyen-lieu`
- `GET /api/nguyen-lieu/{id}`
- `GET /api/nguyen-lieu/canh-bao`
- `POST /api/nguyen-lieu`
- `PATCH /api/nguyen-lieu/{id}`
- `DELETE /api/nguyen-lieu/{id}`
- `GET /api/phieu-nhap-kho`
- `GET /api/phieu-nhap-kho/{id}`
- `POST /api/phieu-nhap-kho`
- `GET /api/cong-thuc-mon/{monAnId}`
- `POST /api/cong-thuc-mon`
- `PATCH /api/cong-thuc-mon/{id}`
- `DELETE /api/cong-thuc-mon/{id}`

### QR theo ban
- `GET /api/qr/ban/{tokenQr}`
- `GET /api/qr/ban/{tokenQr}/mon-an`
- `POST /api/qr/ban/{tokenQr}/don-hang`

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
