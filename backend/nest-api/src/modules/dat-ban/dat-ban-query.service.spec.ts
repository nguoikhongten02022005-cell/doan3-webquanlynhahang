import { DatBanQueryService } from './dat-ban-query.service';

describe('DatBanQueryService', () => {
  const taoService = () => {
    const mysql = {
      truyVan: jest.fn((query: string) => {
        if (query.includes('FROM DatBan')) {
          return Promise.resolve([
            {
              MaDatBan: 'DB006',
              MaKH: 'KH001',
              NgayDat: '2026-05-20',
              GioDat: '12:00:00',
              SoNguoi: 2,
              TrangThai: 'Pending',
              ChiTietMonAn: null,
            },
          ]);
        }

        if (query.includes('FROM DonHang')) {
          return Promise.resolve([
            {
              MaDatBan: 'DB006',
              MaMon: 'M003',
              TenMon: 'Gỏi cuốn tôm thịt',
              SoLuong: 1,
              DonGia: 55000,
            },
            {
              MaDatBan: 'DB006',
              MaMon: 'M008',
              TenMon: 'Trà đào cam sả',
              SoLuong: 2,
              DonGia: 25000,
            },
          ]);
        }

        return Promise.resolve([]);
      }),
    };

    return {
      service: new DatBanQueryService(mysql as any),
      mysql,
    };
  };

  it('includes menu items from orders linked to booking history', async () => {
    const { service } = taoService();

    const response = await service.layLichSuDatBan(
      { vaiTro: 'Admin' },
      'KH001',
    );

    expect((response.data as any[])[0].chiTietMonAn).toEqual([
      { maMon: 'M003', tenMon: 'Gỏi cuốn tôm thịt', soLuong: 1, gia: 55000 },
      { maMon: 'M008', tenMon: 'Trà đào cam sả', soLuong: 2, gia: 25000 },
    ]);
  });

  it('includes menu items from orders linked to internal booking list', async () => {
    const { service } = taoService();

    const response = await service.layDanhSachDatBan();

    expect((response.data as any[])[0].chiTietMonAn).toEqual([
      { maMon: 'M003', tenMon: 'Gỏi cuốn tôm thịt', soLuong: 1, gia: 55000 },
      { maMon: 'M008', tenMon: 'Trà đào cam sả', soLuong: 2, gia: 25000 },
    ]);
  });

  it('does not treat reserved tables as available for booking', async () => {
    const mysql = {
      truyVan: jest
        .fn()
        .mockResolvedValueOnce([
          {
            MaBan: 'B001',
            TenBan: 'Bàn 1',
            SoBan: 1,
            SoChoNgoi: 4,
            TrangThai: 'Reserved',
          },
          {
            MaBan: 'B002',
            TenBan: 'Bàn 2',
            SoBan: 2,
            SoChoNgoi: 4,
            TrangThai: 'Available',
          },
        ])
        .mockResolvedValueOnce([]),
    };
    const service = new DatBanQueryService(mysql as any);

    const response = await service.layKhaDungDatBan({
      ngayDat: '2026-05-21',
      gioDat: '12:00',
      soNguoi: 2,
    });

    expect((response.data as any).tongBanConTrong).toBe(1);
    expect((response.data as any).danhSachBan).toEqual([
      expect.objectContaining({ maBan: 'B002', trangThai: 'Available' }),
    ]);
  });
});
