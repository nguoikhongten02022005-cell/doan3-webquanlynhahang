# CLAUDE.md

## Bat buoc truoc moi task
1. Doc `.skills/00-project-context.md` truoc moi task.
2. Chon va doc skill phu hop theo loai task.
3. Chi sua dung pham vi task. Khong sua lan man.

## Chon skill theo task
- Debug/fix: `.skills/02-safe-code-fix.md`, `.skills/07-debug-workflow.md`
- MCP/DB: `.skills/01-mcp-usage-guide.md`, `.skills/06-database-consistency-check.md`
- Review: `.skills/03-code-review.md`, `.skills/05-api-fe-be-matching.md`
- Nghiep vu: `.skills/04-business-flow-check.md`
- Bao cao/slide: `.skills/08-report-slide-writer.md`
- Nop/demo: `.skills/09-final-submit-checklist.md`

## Rule bat buoc
- Luon tim root cause truoc khi sua.
- Giu response shape FE-BE neu frontend dang dung.
- Khong refactor lon neu khong can.
- Khong ha validation de chieu du lieu sai.
- Debug xong phai quet `git diff` va xoa debug tam.
- Khong de lai `console.log`, `debugger`, `TEMP DEBUG`, file nhap.
- MySQL MCP phai xac nhan `SELECT DATABASE()` la `QuanNhaHang` truoc khi doc/update DB.
- Bang `NguoiDung` dung cot `MaND`, khong dung `MaNguoiDung`.
- `/auth/me` va `/auth/logout` can `Authorization: Bearer <accessToken>`.

## Credential demo
- Admin: `admin@nhahang.com / Admin@123`
- Nhan vien: `an.nv@nhahang.com / Staff@123`
- Khach hang: `khach1@gmail.com / Khach@123`
- Khach hang: `mai.pt@gmail.com / Khach@123`
