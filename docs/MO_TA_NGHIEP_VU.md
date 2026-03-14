# HIEN_TRANG_HE_THONG

## 1. Muc dich file
File nay duoc tao de mo ta hien trang thuc te cua he thong sau khi da:
- doc code frontend
- doi chieu router
- chay va ra soat giao dien bang MCP
- kiem tra luong nghiep vu chinh tu UI va source code

Muc tieu:
- giup AI hieu ro bai hien tai dang co gi
- xac dinh cac chuc nang da co
- xac dinh cac man hinh da duoc kiem tra
- ghi nhan cac han che hien tai cua backend
- lam co so cho viec phat trien backend moi bang C# + ASP.NET Core Web API + MySQL

---

## 2. Hien trang moi truong chay
Frontend hien tai dang chay o:
- `http://localhost:5173`
- co luc co them instance o `http://localhost:5174`

Backend cong `4000` hien tai chua on dinh.

Tac dong:
- mot so du lieu that tu server chua tai duoc on dinh
- van co the xem duoc gan nhu toan bo luong nghiep vu tu giao dien va source code
- cac man can xac minh du lieu that end-to-end can kiem tra lai sau khi backend on dinh

---

## 3. Tong quan chuc nang he thong

### 3.1 Khu vuc khach hang / public
He thong hien tai da co cac chuc nang:
- trang chu
- xem thuc don
- dat ban
- gio hang
- thanh toan
- gioi thieu nha hang

### 3.2 Tai khoan khach hang
He thong hien tai da co:
- dang ky
- dang nhap
- xem ho so ca nhan
- xem lich su don hang
- xem lich su dat ban
- huy booking neu con hop le

### 3.3 Khu vuc noi bo
He thong hien tai da co:
- dang nhap nhan su
- dashboard van hanh
- quan ly booking
- quan ly ban
- theo doi don dang mo

### 3.4 Khu vuc quan tri
Ngoai dashboard chung, admin hien tai con co:
- quan ly mon an
- xem danh sach tai khoan noi bo

---

## 4. Cac man hinh da duoc mo va kiem tra bang MCP

### 4.1 Trang chu
Route: `/`

Noi dung chinh:
- CTA dat ban ngay
- CTA xem thuc don
- khu mon noi bat
- them mon nhanh

### 4.2 Trang thuc don
Route: `/menu`

Chuc nang:
- tim kiem mon an
- loc theo danh muc
- sap xep
- mo chi tiet mon
- them vao gio

### 4.3 Trang dat ban
Route: `/booking`

Chuc nang:
- quy trinh dat ban 3 buoc
- chon so khach
- chon ngay
- chon gio
- chon khu vuc
- nhap lien he
- xac nhan dat

### 4.4 Trang gio hang
Route: `/cart`

Chuc nang:
- xem gio hang
- ap ma giam gia
- nhap so ban
- nhap ghi chu cho quan
- chuyen sang thanh toan

### 4.5 Trang thanh toan
Route: `/checkout`

Chuc nang:
- nhap thong tin lien he
- nhap so ban
- nhap ghi chu
- chon phuong thuc thanh toan
- hoan tat dat hang

### 4.6 Trang ho so
Route: `/profile`

Chuc nang:
- thong tin ca nhan
- lich su don hang
- lich su dat ban

### 4.7 Dang nhap va dang ky
Routes:
- `/login`
- `/register`

### 4.8 Gioi thieu nha hang
Route:
- `/about`

### 4.9 Dang nhap noi bo
Route:
- `/internal/login`

### 4.10 Dashboard noi bo
Route:
- `/internal/dashboard`

Ghi chu:
- co bao ve dang nhap
- hien tai chua vao on dinh vi backend/auth dang loi

---

## 5. Nghiep vu chi tiet theo vai tro

## 5.1 Khach hang
Khach hang hien tai co the:
- xem menu mon an theo danh muc:
  - Mon Chinh
  - Khai Vi
  - Do Uong
  - Trang Mieng
  - Combo
- tim mon theo ten hoac mo ta
- sap xep theo:
  - noi bat
  - gia tang
  - gia giam
  - mon moi
- mo modal chi tiet mon
- chon cau hinh mon
- them mon vao gio
- quan ly gio hang
- nhap voucher
- them ghi chu mon hoac don
- gan so ban
- tao don hang tu gio
- chon phuong thuc thanh toan
- dat ban online theo flow tung buoc
- bi gioi han online toi da 10 khach moi luot
- theo doi ho so
- theo doi lich su order
- theo doi timeline trang thai don
- theo doi lich su booking
- huy booking neu trang thai con cho phep

## 5.2 Nhan su van hanh / host / staff
Nhan su hien tai co the:
- dang nhap khu vuc noi bo
- xem dashboard van hanh tong quan
- xem booking dang theo doi
- xem booking cho xac nhan
- xem ban dang phuc vu
- xem ban dang giu cho
- xem don dang mo
- loc dashboard theo ngay
- loc dashboard theo ca
- xem cac canh bao can xu ly ngay:
  - booking cho xac nhan
  - booking chua gan ban
  - khach sap den
  - ban can don
- tao booking noi bo thu cong
- sua booking noi bo
- gan mot hoac nhieu ban cho booking
- check-in khach
- danh dau hoan thanh booking
- danh dau no-show
- xem tinh trang ban:
  - san sang
  - giu cho
  - dang phuc vu
  - dang don
- danh dau ban dang don
- danh dau ban san sang lai
- xem don dang mo
- xem thong tin thanh toan
- xem tong tien don

## 5.3 Quan tri vien
Quan tri vien hien tai co:
- toan bo quyen cua staff
- quan ly mon an:
  - them mon moi
  - sua mon
  - xoa mon
  - chinh ten
  - chinh mo ta
  - chinh gia
  - chinh danh muc
  - chinh badge
  - chinh tone
  - chinh anh
- xem danh sach tai khoan noi bo
- xem vai tro:
  - Admin
  - Staff
  - Customer
- xem tong quan to chuc noi bo tren dashboard

---

## 6. Route va chuc nang xac nhan tu code

Router chinh nam tai:
- `src/App.jsx`

### 6.1 Route public
- `/`
- `/menu`
- `/booking`
- `/about`
- `/cart`
- `/checkout`
- `/profile`
- `/login`
- `/register`

### 6.2 Route noi bo
- `/internal`
- `/internal/login`
- `/internal/dashboard`

Ghi chu:
- dashboard noi bo dang duoc bao ve dang nhap
- neu khong xac thuc duoc thi se quay ve trang dang nhap noi bo

---

## 7. Tinh trang thuc te khi chay
Frontend:
- chay duoc
- render on
- cac man hinh chinh da xem duoc

Backend `localhost:4000`:
- dang loi ket noi
- khong giu tien trinh on dinh
- mot so man lay du lieu that chua hoat dong on dinh

Cac hien tuong da gap:
- `/menu` luc dau hien `Failed to fetch`
- auth `/auth/me` bi `Unauthorized` hoac `connection refused`
- dashboard noi bo bi tra ve trang dang nhap

---

## 8. Danh gia muc do hoan thien hien tai
Frontend hien tai:
- da co cau truc nghiep vu kha ro
- da co nhieu man hinh chinh
- da co luong khach hang
- da co luong noi bo
- da co phan quyen co ban theo vai tro
- da du lam nen de viet backend moi bam theo

Tuy nhien:
- chua xac minh du lieu that end-to-end day du vi backend chua on dinh
- cac luong can API that van can test lai sau khi backend moi hoat dong on

---

## 9. Y nghia doi voi backend moi
Backend moi viet bang C# + ASP.NET Core Web API + MySQL can hieu ro:

- frontend hien tai khong phai chi co giao dien public
- he thong con co:
  - auth
  - orders
  - bookings
  - tables
  - dashboard noi bo
  - mon an
  - tai khoan
- backend moi nen bam sat nghiep vu hien tai
- neu doi contract API qua nhieu thi frontend se phai sua lai rat nhieu

---

## 10. Nhom API nen uu tien lam truoc
De noi frontend nhanh va an toan, nen uu tien theo thu tu:

### Giai doan 1
- menu items
- loai mon
- mon an
- API hien thi thuc don

### Giai doan 2
- dang nhap
- dang ky
- auth me
- dang xuat

### Giai doan 3
- orders
- checkout
- lich su don hang

### Giai doan 4
- bookings
- tables
- dashboard noi bo

### Giai doan 5
- users
- quan ly admin
- thong ke mo rong

---

## 11. Ghi chu danh cho AI
AI khi doc file nay can hieu:
- day la hien trang he thong sau khi da chay va ra soat giao dien
- frontend da kha day du ve nghiep vu
- backend hien tai chua on dinh nen chua test duoc het end-to-end
- backend moi can bam sat he thong hien tai de tranh sua lai frontend qua nhieu
- can uu tien nghiep vu nha hang tai Viet Nam
- khong duoc hieu bai nay qua don gian chi la menu va gio hang

---

## 12. Ket luan
He thong hien tai da co:
- nhom chuc nang khach hang
- nhom chuc nang tai khoan
- nhom chuc nang noi bo
- nhom chuc nang quan tri

Frontend da du ro de lam co so xay dung backend moi.
Phan viec tiep theo hop ly la:
- on dinh backend moi
- noi lai API theo thu tu uu tien
- test lai tung luong nghiep vu end-to-end