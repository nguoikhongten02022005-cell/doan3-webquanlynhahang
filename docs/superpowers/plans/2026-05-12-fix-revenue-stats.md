# Fix Revenue Statistics Page Implementation Plan

**Goal:** Fix 6 bugs on revenue statistics page: missing booking KPI, zero best-selling items, missing chart dates, inconsistent format, clipped Y-axis, empty state.

**Architecture:** Backend-first: fix `V_MonBanChay` view query to include period filter and correct join. Add booking count endpoint. Frontend: fill 7-day date range, merge API data, format consistently.

**Tech Stack:** NestJS backend, React + Ant Design frontend, MySQL database.

---

## Files to Modify

### Backend
- `backend/nest-api/src/modules/thong-ke/thong-ke.service.ts`
  - Modify `layMonBanChay(limit, tuNgay, denNgay)` to accept date range and filter completed orders
  - Add `layBookingCount(tuNgay, denNgay)` method
- `backend/nest-api/src/modules/thong-ke/thong-ke.controller.ts`
  - Update `layMonBanChay` to accept `tuNgay`, `denNgay` query params
  - Add `GET booking-count` endpoint

### Frontend
- `frontend/src/services/api/apiThongKe.js`
  - Update `layMonBanChayApi(limit)` → `layMonBanChayApi(limit, tuNgay, denNgay)`
  - Add `layBookingCountApi(tuNgay, denNgay)`
- `frontend/src/pages/noiBo/NoiBoThongKePage.jsx`
  - Call both APIs with date range
  - Display booking count KPI
  - Fix top dishes mapping to use `TongSoLuong`, `TongDoanhThu`
- `frontend/src/features/noiBo/dashboard/BieuDoDoanhThu.jsx`
  - Accept `dateRange` prop, generate full 7-day series
  - Merge API data with date series (zero-fill missing days)
  - Fix average format, chart padding, empty state

---

## Tasks

### Task 1: Backend - Fix MonBanChay Query
**Files:** `backend/nest-api/src/modules/thong-ke/thong-ke.service.ts`, `backend/nest-api/src/modules/thong-ke/thong-ke.controller.ts`
**Test:** Run API, verify non-zero results for period with orders

- [ ] **Step 1: Update service method signature**
```typescript
async layMonBanChay(limit: number = 10, tuNgay?: string, denNgay?: string) {
  const params: any[] = [limit];
  let dateFilter = '';
  
  if (tuNgay && denNgay) {
    dateFilter = 'AND DATE(hd.NgayXuat) BETWEEN ? AND ?';
    params.push(tuNgay, denNgay);
  }
  
  const danhSach = await this.mysql.truyVan(`
    SELECT 
      td.MaMon,
      td.TenMon,
      dm.TenDanhMuc,
      SUM(ct.SoLuong) AS TongSoLuong,
      SUM(ct.ThanhTien) AS TongDoanhThu
    FROM ChiTietDonHang ct
    JOIN ThucDon td ON td.MaMon = ct.MaMon
    JOIN DanhMuc dm ON dm.MaDanhMuc = td.MaDanhMuc
    JOIN DonHang dh ON dh.MaDonHang = ct.MaDonHang
    JOIN HoaDon hd ON hd.MaDonHang = dh.MaDonHang
    WHERE dh.TrangThai NOT IN ('Cancelled')
    AND hd.TrangThai = 'Success'
    ${dateFilter}
    GROUP BY td.MaMon, td.TenMon, dm.TenDanhMuc
    ORDER BY TongSoLuong DESC
    LIMIT ?
  `, params);
  
  return taoPhanHoi(danhSach, 'Lấy món bán chạy thành công');
}
```

- [ ] **Step 2: Update controller**
```typescript
@Get('mon-ban-chay')
layMonBanChay(@Query('limit') limit?: string, @Query('tuNgay') tuNgay?: string, @Query('denNgay') denNgay?: string) {
  return this.thongKeService.layMonBanChay(Number(limit) || 10, tuNgay, denNgay);
}
```

- [ ] **Step 3: Commit**
```bash
git add backend/nest-api/src/modules/thong-ke/
git commit -m "fix: mon-ban-chay query with date filter and correct join"
```

### Task 2: Backend - Add Booking Count Endpoint
**Files:** `backend/nest-api/src/modules/thong-ke/thong-ke.service.ts`, `backend/nest-api/src/modules/thong-ke/thong-ke.controller.ts`

- [ ] **Step 1: Add service method**
```typescript
async layBookingCount(tuNgay: string, denNgay: string) {
  const result = await this.mysql.truyVan(`
    SELECT COUNT(*) AS tongBooking
    FROM DatBan
    WHERE NgayDat BETWEEN ? AND ?
    AND TrangThai NOT IN ('Cancelled', 'NoShow')
  `, [tuNgay, denNgay]);
  
  return taoPhanHoi(result[0], 'Lấy số booking thành công');
}
```

- [ ] **Step 2: Add controller endpoint**
```typescript
@ApiOperation({ summary: 'Lấy số lượng booking trong kỳ' })
@Get('booking-count')
layBookingCount(@Query('tuNgay') tuNgay: string, @Query('denNgay') denNgay: string) {
  return this.thongKeService.layBookingCount(tuNgay, denNgay);
}
```

- [ ] **Step 3: Commit**
```bash
git add backend/nest-api/src/modules/thong-ke/
git commit -m "feat: add booking-count endpoint"
```

### Task 3: Frontend - Update API Client
**Files:** `frontend/src/services/api/apiThongKe.js`

- [ ] **Step 1: Update layMonBanChayApi signature**
```javascript
export const layMonBanChayApi = (limit = 10, tuNgay, denNgay) =>
  trinhKhachApi.get('/thong-ke/mon-ban-chay', { params: { limit, tuNgay, denNgay } }).then(tachPhanHoiApi);
```

- [ ] **Step 2: Add layBookingCountApi**
```javascript
export const layBookingCountApi = (tuNgay, denNgay) =>
  trinhKhachApi.get('/thong-ke/booking-count', { params: { tuNgay, denNgay } }).then(tachPhanHoiApi);
```

- [ ] **Step 3: Commit**
```bash
git add frontend/src/services/api/apiThongKe.js
git commit -m "fix: update API client for mon-ban-chay and booking-count"
```

### Task 4: Frontend - NoiBoThongKePage Integration
**Files:** `frontend/src/pages/noiBo/NoiBoThongKePage.jsx`

- [ ] **Step 1: Import new API**
```javascript
import { layDoanhThuNgayApi, layMonBanChayApi, layDoanhThuThangApi, layBookingCountApi } from '../../services/api/apiThongKe'
```

- [ ] **Step 2: Update queryKey for mon-ban-chay**
```javascript
const { data: duLieuMonBanChay = [], isLoading: dangTaiMonBanChay } = useQuery({
  queryKey: ['thong-ke-mon-ban-chay', tuNgay, denNgay],
  queryFn: async () => {
    const ketQua = await layMonBanChayApi(10, tuNgay, denNgay)
    return ketQua.duLieu || []
  },
})
```

- [ ] **Step 3: Add booking count query**
```javascript
const { data: duLieuBooking = { tongBooking: 0 }, isLoading: dangTaiBooking } = useQuery({
  queryKey: ['thong-ke-booking-count', tuNgay, denNgay],
  queryFn: async () => {
    const ketQua = await layBookingCountApi(tuNgay, denNgay)
    return ketQua.duLieu || { tongBooking: 0 }
  },
})
```

- [ ] **Step 4: Fix topDishes mapping**
```javascript
const topDishes = useMemo(
  () => (duLieuMonBanChay || []).slice(0, 10).map((mon, chiSo) => ({
    ...mon,
    rank: chiSo + 1,
    name: mon.TenMon || mon.tenMon || '',
    quantity: Number(mon.TongSoLuong || 0),
    revenue: Number(mon.TongDoanhThu || 0),
    percent: duLieuMonBanChay.length > 0
      ? Math.round((Number(mon.TongDoanhThu || 0) / duLieuMonBanChay.reduce((t, m) => t + Number(m.TongDoanhThu || 0), 0)) * 100)
      : 0,
  })),
  [duLieuMonBanChay]
)
```

- [ ] **Step 5: Commit**
```bash
git add frontend/src/pages/noiBo/NoiBoThongKePage.jsx
git commit -m "fix: integrate booking count and fix top dishes mapping"
```

### Task 5: Frontend - BieuDoDoanhThu Date Fill
**Files:** `frontend/src/features/noiBo/dashboard/BieuDoDoanhThu.jsx`

- [ ] **Step 1: Accept dateRange prop and generate series**
```javascript
function BieuDoDoanhThu({ revenue, dateRange, title = 'Doanh thu 7 ngày gần nhất', loading = false }) {
  // Generate full date series from dateRange
  const fullSeries = useMemo(() => {
    if (!dateRange?.tuNgay || !dateRange?.denNgay) return [];
    
    const start = new Date(dateRange.tuNgay);
    const end = new Date(dateRange.denNgay);
    const series = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      series.push({ label: label, date: dateStr, revenue: 0, completedOrders: 0 });
    }
    
    return series;
  }, [dateRange]);
  
  // Merge API data into full series
  const duLieuCot = useMemo(() => {
    if (!Array.isArray(revenue?.series)) return fullSeries;
    
    const map = new Map(fullSeries.map(item => [item.label, { ...item }]));
    
    revenue.series.forEach(apiItem => {
      if (map.has(apiItem.label)) {
        const existing = map.get(apiItem.label);
        map.set(apiItem.label, {
          ...existing,
          revenue: Math.max(Number(apiItem.revenue) || 0, 0),
          completedOrders: Number(apiItem.completedOrders) || 0,
        });
      }
    });
    
    return Array.from(map.values());
  }, [revenue?.series, fullSeries]);
  
  // ... rest of calculations
}
```

- [ ] **Step 2: Fix average format**
```javascript
// Line 187: Use dinhDangTienTe instead of dinhDangTienRutGon
<strong>{dinhDangTienTe(doanhThuTrungBinh)}</strong>
```

- [ ] **Step 3: Increase chart marginTop**
```javascript
marginTop: nenHienLabelCot ? 40 : 30,  // was 30:20
```

- [ ] **Step 4: Commit**
```bash
git add frontend/src/features/noiBo/dashboard/BieuDoDoanhThu.jsx
git commit -m "fix: fill 7-day date series and fix chart formatting"
```

### Task 6: Testing
**Test:** Run backend, verify APIs return correct data. Run frontend, verify all 6 issues fixed.

- [ ] **Step 1: Start backend**
```bash
cd backend/nest-api && npm run start:dev
```

- [ ] **Step 2: Start frontend**
```bash
cd frontend && npm run dev
```

- [ ] **Step 3: Verify**
- Check booking KPI shows number
- Check top dishes shows non-zero quantity/revenue
- Check chart shows 7 columns (including today)
- Check average uses full format (221.931đ)
- Check Y-axis label not clipped
- Check empty state when no data

- [ ] **Step 4: Commit**
```bash
git commit -am "test: verify revenue statistics page fixes"
```
