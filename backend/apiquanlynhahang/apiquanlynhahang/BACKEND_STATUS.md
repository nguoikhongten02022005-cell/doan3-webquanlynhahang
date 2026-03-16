# BACKEND STATUS

## Tong quan
Backend C# trong `backend/apiquanlynhahang/apiquanlynhahang` da duoc nang cap tu mau mac dinh thanh backend co the chay va test local voi MySQL.

## Da hoan thanh
- Tao schema MySQL va du lieu mau tieng Viet khong dau
- Ket noi EF Core voi MySQL
- Swagger de test API
- API doc/ghi co ban cho:
  - `mon_an`
  - `ban_an`
  - `dat_ban`
  - `don_hang`
  - `ma_giam_gia`
  - `nguoi_dung`
- Auth co ban:
  - `register`
  - `login`
  - `internal-login`
  - `me`
  - `update me`
- JWT Bearer that
- Phan quyen route theo role
- Middleware xu ly loi toan cuc
- Validate nghiep vu o cac service chinh
- Da bat CORS local de frontend Vite goi truc tiep backend C#

## Trang thai auth hien tai
- Access token la JWT that
- Co the dung token tren Swagger/Postman
- `refresh token` chua hoan chinh theo luong production
- Chua co cookie auth va chua co session management day du

## Trang thai nghiep vu
- Luong co the test duoc:
  - dang ky -> dang nhap
  - xem mon an
  - tao dat ban -> cap nhat trang thai -> gan ban
  - validate voucher -> tao don hang -> cap nhat trang thai

## Nhung han che hien tai
- Chua co test tu dong unit/integration
- Chua co refresh token day du trong `token_lam_moi`
- Chua chuan hoa mot model response thong nhat cho moi endpoint
- Chua co logging nghiep vu chi tiet
- Chua tach ro middleware authorize theo policy

## Viec nen lam tiep
1. Hoan thien refresh token va logout that
2. Them test integration cho cac luong chinh
3. Chuan hoa response model va ma loi
4. Hoan thien logging va cau hinh moi truong
5. Them `Cors:AllowedOrigins` rieng cho tung moi truong neu dua len server that

## Ghi chu van hanh
- Can set `Jwt__Secret` co dinh neu muon token on dinh sau restart
- Neu app dang chay, `dotnet build` co the bi loi khoa file `.exe`; can stop app truoc khi build lai
- Swagger local:
  - `https://localhost:7038/swagger`
- Frontend local co the goi qua `http://localhost:5011/api` ma khong bi redirect HTTPS trong Development

## Anh huong voi repo tong
- Backend C# nay da duoc nang cap dang ke trong `backend/`
- Tuy nhien `server/` van la backend chinh cua luong phat trien hien tai neu chua chuyen doi chinh thuc
- Can thong nhat ro neu sau nay quyet dinh chuyen frontend sang backend C# nay
