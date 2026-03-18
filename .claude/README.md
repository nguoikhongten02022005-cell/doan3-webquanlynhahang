# .claude trong repo nay

Thu muc `.claude/` luu tri thuc dieu phoi danh cho Claude Code theo cau truc de doc, de tim va de bao tri hon so voi artifact cu.

## Cau truc

### `skills/`

Chua cac skill co the invoke theo dang `skills/<ten>/SKILL.md`.

Hien tai co:

- `api-full-test`: quy trinh kiem thu full API cho backend C# local/dev, co uu tien repo discovery, Postman, MySQL verification, safe auto-fix nho va mot vong retest.

Skill co the di kem thu muc `references/` rieng de chua tai lieu huong dan bo tro.

### `agents/`

Chua cac role guide de dinh huong cach Claude nen lam viec theo tung vai tro trong repo nay.

Hien tai co:

- `frontend.md`
- `review.md`
- `backend-csharp.md`

Cac file nay khong phai metadata subagent cua OpenCode, ma la tai lieu role ro rang de Claude doc va ap dung khi lam viec.

### `references/`

Chua reference chung cap repo, khong gan rieng voi mot skill nao.

Hien tai co:

- `frontend-state-quy-uoc.md`: quy uoc phan tach state giua TanStack Query, Zustand, `useState` va Ant Design Form.

## Nguyen tac doc nhanh

- Can slash skill hoac quy trinh thao tac cu the: vao `skills/`.
- Can vai tro hoac gioi han theo loai cong viec: vao `agents/`.
- Can quy uoc chung cua repo: vao `references/`.

## Ghi chu migrate

Noi dung trong `.claude/` duoc tach tu bo tri thuc cu de giu phan con gia tri nghiep vu, dong thoi loai bo metadata va runtime khong con can thiet cho Claude Code.
