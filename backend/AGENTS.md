# AGENTS.md

## Pham vi
File nay ap dung cho toan bo thu muc `backend/`.

## Vi tri cua `backend/` trong repo hien tai
Thu muc `backend/` la backend NestJS + MySQL chinh cua du an trong hien trang hien tai.

Trong do, `backend/nest-api` la backend dang duoc dung de phat trien, kiem thu va demo.

## Muc tieu
Khi chinh sua backend:
- uu tien sua dung chuc nang duoc yeu cau
- khong sua lan sang frontend neu khong that su can
- khong refactor lon neu chua duoc yeu cau
- giu contract API on dinh voi frontend dang ket noi vao `http://localhost:5011/api`

## Cong nghe
- Ngon ngu: TypeScript
- Framework: NestJS
- Database: MySQL

## Quy tac backend
- Khong tu y doi route, ten field response hoac kieu du lieu tra ve neu frontend dang dung
- Khong hard-code chuoi ket noi database, mat khau, token hoac khoa bi mat
- Khong tu y xoa bang, cot hoac du lieu can thiet
- Can than voi `DELETE`, `UPDATE` khong co `WHERE`
- Uu tien sua it nhat co the nhung dung ban chat loi

## Khi hoan thanh
Luon bao ro:
- da sua file nao
- sua gi
- ly do sua
- co anh huong API, database hoac du lieu hay khong
- can kiem tra them gi sau khi sua
