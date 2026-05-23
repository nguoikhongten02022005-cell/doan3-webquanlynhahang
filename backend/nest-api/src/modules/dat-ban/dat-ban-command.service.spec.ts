import { DatBanCommandService } from './dat-ban-command.service';

describe('DatBanCommandService', () => {
  it('persists internal note when creating a booking', async () => {
    const mysql = {
      truyVan: jest.fn().mockResolvedValue([]),
      thucThi: jest.fn().mockResolvedValue(undefined),
    };
    const datBanQueryService = {
      chuyenDatBanSangPhanHoi: jest.fn((booking) => booking),
    };
    const donHangCreateOrderService = {
      taoDonHang: jest.fn().mockResolvedValue(undefined),
    };
    const service = new DatBanCommandService(
      mysql as any,
      datBanQueryService as any,
      donHangCreateOrderService as any,
    );

    await service.taoDatBan({ vaiTro: 'Admin' }, {
      maDatBan: 'DB_TEST',
      ngayDat: '2026-05-21',
      gioDat: '21:00',
      soNguoi: 9,
      ghiChuNoiBo: 'Nhóm từ 5 người trở lên',
    } as any);

    const [query, params] = mysql.thucThi.mock.calls[0];
    expect(query).toContain('GhiChuNoiBo');
    expect(params).toContain('Nhóm từ 5 người trở lên');
  });

  it('creates table order from booking menu items after booking is inserted', async () => {
    const mysql = {
      truyVan: jest.fn().mockResolvedValue([]),
      thucThi: jest.fn().mockResolvedValue(undefined),
    };
    const datBanQueryService = {
      chuyenDatBanSangPhanHoi: jest.fn((booking) => booking),
    };
    const donHangCreateOrderService = {
      taoDonHang: jest.fn().mockResolvedValue(undefined),
    };
    const service = new (DatBanCommandService as any)(
      mysql,
      datBanQueryService,
      donHangCreateOrderService,
    ) as DatBanCommandService;

    await service.taoDatBan({ vaiTro: 'Admin' }, {
      maDatBan: 'DB_TEST_ORDER',
      maKH: 'KH001',
      maBan: 'B006',
      ngayDat: '2026-05-21',
      gioDat: '21:00',
      soNguoi: 4,
      chiTietMonAn: [{ maMon: 'M001', soLuong: 2, ghiChu: 'Ít cay' }],
    } as any);

    expect(donHangCreateOrderService.taoDonHang).toHaveBeenCalledWith({
      maKH: 'KH001',
      maBan: 'B006',
      maNV: null,
      maDatBan: 'DB_TEST_ORDER',
      chiTiet: [{ maMon: 'M001', soLuong: 2, ghiChu: 'Ít cay' }],
      nguonTao: 'DatBan',
      trangThai: 'Pending',
      soDiem: 0,
      nguoiDung: { vaiTro: 'Admin' },
      ghiChu: null,
    });
  });
});
