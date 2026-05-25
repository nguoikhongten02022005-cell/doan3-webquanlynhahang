import { MaGiamGiaService } from './ma-giam-gia.service';

describe('MaGiamGiaService', () => {
  const taoService = (danhSachVoucher: any[]) => {
    const mysql = {
      truyVan: jest.fn(async (query: string) => {
        if (String(query).includes('FROM KhachHang')) {
          return [{ MaKH: 'KH001' }];
        }

        if (String(query).includes('FROM MaGiamGia')) {
          return danhSachVoucher;
        }

        return [];
      }),
      thucThi: jest.fn(),
    };

    return {
      service: new MaGiamGiaService(mysql as any),
      mysql,
    };
  };

  const voucherCoBan = {
    MaCode: 'LOYALTY-TEST',
    TenCode: 'Voucher doi diem',
    GiaTri: 10000,
    LoaiGiam: 'fixed_amount',
    LoaiMa: 'LOYALTY',
    MaKH: 'KH001',
    DiemDaDoi: 100,
    GiaTriToiDa: null,
    DonHangToiThieu: 0,
    NgayBatDau: '2026-05-01',
    NgayKetThuc: '2026-06-30',
    SoLanToiDa: 1,
    SoLanDaDung: 0,
    TrangThai: 'Active',
    NguonTao: 'DOI_DIEM_TICH_LUY',
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-25T09:00:00+07:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('danh dau voucher chua hieu luc trong ho so khi ngay bat dau nam trong tuong lai', async () => {
    const { service } = taoService([
      {
        ...voucherCoBan,
        NgayBatDau: '2026-05-31',
        NgayKetThuc: '2026-06-30',
      },
    ]);

    const ketQua = await service.layCuaToi({ maND: 'ND001' } as any);
    const voucher = (ketQua.data as any[])[0];

    expect(voucher.trangThaiRuntime).toBe('UPCOMING');
    expect(voucher.trangThaiHienThi).toBe('Chưa hiệu lực');
    expect(voucher.coTheApDung).toBe(false);
  });

  it('danh dau voucher het luot trong ho so la het luot', async () => {
    const { service } = taoService([
      {
        ...voucherCoBan,
        SoLanToiDa: 1,
        SoLanDaDung: 1,
      },
    ]);

    const ketQua = await service.layCuaToi({ maND: 'ND001' } as any);
    const voucher = (ketQua.data as any[])[0];

    expect(voucher.trangThaiRuntime).toBe('USED_UP');
    expect(voucher.trangThaiHienThi).toBe('Hết lượt');
    expect(voucher.coTheApDung).toBe(false);
  });

  it('danh dau voucher tam tat trong ho so la tam tat', async () => {
    const { service } = taoService([
      {
        ...voucherCoBan,
        TrangThai: 'Inactive',
      },
    ]);

    const ketQua = await service.layCuaToi({ maND: 'ND001' } as any);
    const voucher = (ketQua.data as any[])[0];

    expect(voucher.trangThaiRuntime).toBe('INACTIVE');
    expect(voucher.trangThaiHienThi).toBe('Tạm tắt');
    expect(voucher.coTheApDung).toBe(false);
  });
});
