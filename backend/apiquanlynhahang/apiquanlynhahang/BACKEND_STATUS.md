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

## Hien trang MySQL
- CSDL hien da du de chay cac nghiep vu cot loi cua bai:
  - `nguoi_dung`
  - `token_lam_moi`
  - `khu_vuc_ban`
  - `ban_an`
  - `dat_ban`
  - `chi_tiet_dat_ban`
  - `mon_an`
  - `ma_giam_gia`
  - `don_hang`
  - `chi_tiet_don_hang`
- Cac bang tren da du cho auth, menu, table, booking, order va voucher.
- Hien chua co bang rieng cho bao cao thong ke, kho nguyen lieu va QR goi mon theo ban.

## De xuat mo rong MySQL
- De phu hop huong mo rong cua bai, nen bo sung theo nhom bang nho gon nhu sau:

### Bao cao thong ke
- Khong can tao bang bao cao rieng o giai doan dau.
- Uu tien dung truy van tong hop tu `don_hang`, `chi_tiet_don_hang`, `dat_ban`, `ban_an`, `ma_giam_gia`.
- Khi du lieu lon hon moi can tinh den bang tong hop ngay.

### Kho nguyen lieu
- `nguyen_lieu`: thong tin nguyen lieu, don vi tinh, ton kho, muc canh bao
- `phieu_nhap_kho`: phieu nhap tong
- `chi_tiet_nhap_kho`: danh sach nguyen lieu trong tung phieu nhap
- `cong_thuc_mon_an`: dinh luong nguyen lieu theo mon
- `bien_dong_kho`: lich su cong tru ton kho de de doi chieu va debug

### QR goi mon theo ban
- Uu tien mo rong tren bang `ban_an` hien co bang cach them:
  - `ma_qr`
  - `token_qr`
  - `kich_hoat_qr`
- Khong can tao bang order rieng cho QR neu van tai su dung `don_hang`.
- Neu can theo doi nhat ky yeu cau tai ban, co the them `yeu_cau_tai_ban` o buoc sau.

## Danh gia hien tai
- MySQL da du cho phan nghiep vu cot loi hien co.
- MySQL chua day du neu muon noi he thong theo huong bao cao, kho va QR mot cach tron ven.
- Huong hop ly nhat la giu cac bang cot loi hien tai, sau do mo rong them bang nho gon theo tung module, tranh sua lon vao schema dang chay.

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
- Backend C# nay la backend chinh dang duoc su dung trong repo.
- Frontend dang duoc cau hinh de ket noi truc tiep voi backend C# qua `http://localhost:5011/api`.
- Cac tai lieu va huong dan van hanh can uu tien backend nay.
