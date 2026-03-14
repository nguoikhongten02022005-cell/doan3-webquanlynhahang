# Legacy backend

Thư mục `backend/` chỉ còn để tham khảo lịch sử.

Backend canonical đang dùng cho repo này nằm trong `../server/`.

## Không dùng cho flow phát triển chính

Nếu bạn cần chạy backend thật cho frontend ở root, hãy dùng `server/`:

```bash
cd ../server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Ghi chú

- Contract nguồn sự thật cho auth, booking, order đều nằm trong `server/src/modules/**`.
- Các file Postman/env trong `backend/` là legacy và có thể không còn phản ánh hệ thống hiện tại.
