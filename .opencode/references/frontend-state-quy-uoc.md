# Quy uoc dung Zustand va TanStack Query

Tai frontend cua du an nay, can tach ro tung loai state de tranh trung lap, kho debug va kho bao tri.

## Nguyen tac chinh

- `TanStack Query` quan ly `server state`.
- `Zustand` quan ly `client state` va `app state`.
- `useState` xu ly state cuc bo trong mot component.
- `Ant Design Form` quan ly state nhap lieu va validation cua form.

## Khi dung TanStack Query

Dung `TanStack Query` khi du lieu:

- duoc lay tu API
- can cache
- can refetch
- can dong bo lai sau `create`, `update`, `delete`
- can loading, error, stale state
- duoc dung lai o nhieu man hinh nhung nguon su that van la server

Vi du phu hop:

- danh sach mon an
- chi tiet ban an
- lich su dat ban
- danh sach voucher
- bao cao doanh thu
- thong tin don hang theo ma

Nen uu tien:

- `useQuery` cho doc du lieu
- `useMutation` cho ghi du lieu
- `queryKey` ro nghia theo nghiep vu
- `invalidateQueries` sau khi mutation thanh cong neu du lieu can tai lai
- `setQueryData` khi can cap nhat cache truc tiep mot cach ro rang va an toan

Khong nen:

- copy ket qua API tu `TanStack Query` sang `Zustand` chi de render
- tu viet them loading, error, retry, cache bang tay neu `TanStack Query` da giai quyet

## Khi dung Zustand

Dung `Zustand` khi state:

- la state giao dien dung chung cho nhieu component
- khong phai nguon du lieu chinh tu server
- can ton tai xuyen suot giua nhieu route hoac layout
- can thao tac nhanh o client truoc khi submit len server

Vi du phu hop:

- thong tin nguoi dung dang nhap dang luu tai client
- quyen hien thi menu theo vai tro
- bo loc tam thoi cua man hinh
- trang thai dong mo modal, drawer, popup
- buoc hien tai cua quy trinh dat ban hoac tao don
- gio hang tam thoi hoac phieu tam truoc khi gui API
- che do xem dang la `table` hay `card`

Khong nen:

- luu danh sach API lon vao store global neu van phai refetch tu server
- bien store thanh noi chua moi thu
- dung `Zustand` thay cho form state thong thuong

## Khi dung useState

Dung `useState` khi state chi phuc vu mot component hoac mot cum component rat gan nhau.

Vi du:

- tab dang chon trong mot trang
- text tim kiem tam thoi chua submit
- trang thai hover, expand, selected row tam thoi
- mo ta xem truoc trong mot modal rieng

Neu state nay bat dau duoc chia se rong hon, luc do moi can nhac dua len `Zustand`.

## Khi dung Ant Design Form

Dung `Ant Design Form` cho:

- state cua input
- validation
- reset form
- gan gia tri mac dinh
- submit payload

Quy trinh de nghi:

1. `Form` quan ly gia tri nhap.
2. Nut submit goi `mutation` cua `TanStack Query`.
3. Thanh cong thi thong bao, dong form, `invalidateQueries` neu can.
4. Chi dua mot phan du lieu sang `Zustand` neu do la state tam xuyen man hinh.

## Quy tac tranh chong cheo

- Du lieu tu API: uu tien `TanStack Query`.
- State UI dung chung: uu tien `Zustand`.
- State cuc bo: uu tien `useState`.
- State form: uu tien `Ant Design Form`.

Neu mot du lieu vua can luu tam o client vua co ban goc tu server, can tach ro:

- ban goc trong `TanStack Query`
- phan chinh sua tam trong `Form` hoac `Zustand` tuy pham vi su dung

## Mau ra quyet dinh nhanh

- Co fetch tu API khong? Neu co, nghi toi `TanStack Query` truoc.
- Co chi dung trong mot component khong? Neu co, nghi toi `useState` truoc.
- Co la form input khong? Neu co, nghi toi `Ant Design Form` truoc.
- Co can chia se giua nhieu component hoac nhieu route nhung khong phai server state khong? Neu co, nghi toi `Zustand`.

## Muc tieu

Muc tieu cua quy uoc nay la:

- giam duplicate state
- de debug hon
- tranh cache tay sai
- giu luong du lieu ro rang
- de mo rong khi du an lon dan
