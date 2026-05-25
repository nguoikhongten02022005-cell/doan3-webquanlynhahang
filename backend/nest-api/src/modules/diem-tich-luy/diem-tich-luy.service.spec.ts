import { DiemTichLuyService } from './diem-tich-luy.service';

describe('DiemTichLuyService', () => {
  it('su dung cung ketNoi khi doi diem trong transaction', async () => {
    const ketNoi = {
      query: jest
        .fn()
        .mockResolvedValueOnce([[{ MaKH: 'KH006', DiemTichLuy: 320 }]])
        .mockResolvedValueOnce([[{ MaKH: 'KH006', DiemTichLuy: 320 }]]),
      execute: jest.fn(async () => undefined),
    };

    const mysql = {
      giaoDich: jest.fn(),
      truyVan: jest.fn(),
      thucThi: jest.fn(),
    };

    const maGiamGiaService = {
      tinhSoTienGiamTuDiem: jest.fn((soDiem: number) => Math.floor(Number(soDiem || 0) / 100) * 10000),
      taoVoucherTuDoiDiem: jest.fn(async (_payload, con) => ({
        voucher: {
          maCode: 'LOYAL25K',
          tenCode: 'Voucher doi diem',
          maKH: 'KH006',
        },
        maCode: 'LOYAL25K',
        tenCode: 'Voucher doi diem',
        soDiemDaDoi: 100,
        soTienGiam: 10000,
        connection: con,
      })),
    };

    const service = new DiemTichLuyService(
      mysql as any,
      maGiamGiaService as any,
    );

    const ketQua = await service.doiDiem(
      { maND: 'ND010' },
      { soDiem: 100, moTa: 'Doi diem' },
      ketNoi as any,
    );

    expect(mysql.giaoDich).not.toHaveBeenCalled();
    expect(ketNoi.execute).toHaveBeenCalledWith(
      expect.stringContaining(
        'UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?',
      ),
      [220, 'KH006'],
    );
    expect(maGiamGiaService.taoVoucherTuDoiDiem).toHaveBeenCalledWith(
      expect.objectContaining({
        maKH: 'KH006',
        soDiemDaDoi: 100,
        soTienGiam: 10000,
      }),
      ketNoi,
    );
    expect((ketQua.data as any).voucher.maCode).toBe('LOYAL25K');
  });

  it('khong tao trung lich su va voucher khi doi diem lap lai cung maYeuCau', async () => {
    const store = {
      diemTichLuy: 245,
      lichSu: [] as any[],
      voucher: [] as any[],
    };

    const ketNoi = {
      query: jest.fn(async (query: string, thamSo: any[]) => {
        if (String(query).includes('FROM KhachHang WHERE MaND = ?')) {
          return [[{ MaKH: 'KH006', MaND: 'ND010', DiemTichLuy: store.diemTichLuy }]];
        }

        if (String(query).includes('FROM KhachHang WHERE MaKH = ?')) {
          return [[{ MaKH: 'KH006', MaND: 'ND010', DiemTichLuy: store.diemTichLuy }]];
        }

        if (String(query).includes('FROM LichSuDiemTichLuy WHERE MaGiaoDichDiem = ?')) {
          const maGiaoDich = String(thamSo?.[0] || '');
          const lichSu = store.lichSu.find((item) => item.MaGiaoDichDiem === maGiaoDich);
          return [[lichSu ? { ...lichSu } : null].filter(Boolean)];
        }

        if (String(query).includes('FROM MaGiamGia WHERE MaCode = ?')) {
          const maCode = String(thamSo?.[0] || '');
          const voucher = store.voucher.find((item) => item.MaCode === maCode);
          return [[voucher ? { ...voucher } : null].filter(Boolean)];
        }

        return [[]];
      }),
      execute: jest.fn(async (query: string, thamSo: any[]) => {
        if (String(query).includes('UPDATE KhachHang SET DiemTichLuy = ? WHERE MaKH = ?')) {
          store.diemTichLuy = Number(thamSo?.[0] || 0);
          return;
        }

        if (String(query).includes('INSERT INTO LichSuDiemTichLuy')) {
          store.lichSu.push({
            MaGiaoDichDiem: String(thamSo?.[0] || ''),
            MaKH: String(thamSo?.[1] || ''),
            MaDonHang: thamSo?.[2] || null,
            LoaiBienDong: String(thamSo?.[3] || ''),
            SoDiem: Number(thamSo?.[4] || 0),
            SoDiemTruoc: Number(thamSo?.[5] || 0),
            SoDiemSau: Number(thamSo?.[6] || 0),
            MoTa: String(thamSo?.[7] || ''),
          });
          return;
        }

        if (String(query).includes('INSERT INTO MaGiamGia')) {
          store.voucher.push({
            MaCode: String(thamSo?.[0] || ''),
            TenCode: String(thamSo?.[1] || ''),
            GiaTri: Number(thamSo?.[2] || 0),
            LoaiGiam: String(thamSo?.[3] || ''),
            LoaiMa: String(thamSo?.[4] || ''),
            MaKH: String(thamSo?.[5] || ''),
            DiemDaDoi: Number(thamSo?.[6] || 0),
            GiaTriToiDa: thamSo?.[7] ?? null,
            DonHangToiThieu: Number(thamSo?.[8] || 0),
            NgayBatDau: thamSo?.[9] || null,
            NgayKetThuc: thamSo?.[10] || null,
            SoLanToiDa: Number(thamSo?.[11] || 0),
            SoLanDaDung: Number(thamSo?.[12] || 0),
            TrangThai: String(thamSo?.[13] || ''),
            NguonTao: String(thamSo?.[14] || ''),
          });
        }
      }),
    };

    const mysql = {
      giaoDich: jest.fn(async (callback) => callback(ketNoi)),
      truyVan: jest.fn(async (query: string) => {
        if (String(query).includes('FROM KhachHang')) {
          return [{ MaKH: 'KH006', MaND: 'ND010', DiemTichLuy: store.diemTichLuy }];
        }

        return [];
      }),
      thucThi: jest.fn(),
    };

    const maGiamGiaService = {
      tinhSoTienGiamTuDiem: jest.fn((soDiem: number) => Math.floor(Number(soDiem || 0) / 100) * 10000),
      taoVoucherTuDoiDiem: jest.fn(async (payload) => {
        const maCode = `LOYALTY-KH006_REQ001`;
        const daCo = store.voucher.find((item) => item.MaCode === maCode);
        if (daCo) {
          return {
            voucher: {
              maCode: daCo.MaCode,
              tenCode: daCo.TenCode,
              maKH: daCo.MaKH,
            },
            maCode: daCo.MaCode,
            tenCode: daCo.TenCode,
            soDiemDaDoi: Number(daCo.DiemDaDoi || payload.soDiemDaDoi || 0),
            soTienGiam: Number(daCo.GiaTri || payload.soTienGiam || 0),
          };
        }

        const voucher = {
          MaCode: maCode,
          TenCode: 'Voucher doi diem',
          MaKH: payload.maKH,
          DiemDaDoi: payload.soDiemDaDoi,
          GiaTri: payload.soTienGiam,
        };
        store.voucher.push(voucher);
        return {
          voucher: {
            maCode: voucher.MaCode,
            tenCode: voucher.TenCode,
            maKH: voucher.MaKH,
          },
          maCode: voucher.MaCode,
          tenCode: voucher.TenCode,
          soDiemDaDoi: voucher.DiemDaDoi,
          soTienGiam: voucher.GiaTri,
        };
      }),
    };

    const service = new DiemTichLuyService(
      mysql as any,
      maGiamGiaService as any,
    );

    const lan1 = await service.doiDiem(
      { maND: 'ND010' },
      { soDiem: 100, moTa: 'Doi diem', maYeuCau: 'req-001' } as any,
      ketNoi as any,
    );

    const lan2 = await service.doiDiem(
      { maND: 'ND010' },
      { soDiem: 100, moTa: 'Doi diem', maYeuCau: 'req-001' } as any,
      ketNoi as any,
    );

    expect(lan1.data).toMatchObject({
      diemTruoc: 245,
      diemSau: 145,
      soDiemDaDoi: 100,
      soTienGiam: 10000,
    });
    expect(lan2.data).toMatchObject({
      diemTruoc: 245,
      diemSau: 145,
      soDiemDaDoi: 100,
      soTienGiam: 10000,
    });
    expect(store.diemTichLuy).toBe(145);
    expect(store.lichSu).toHaveLength(1);
    expect(store.voucher).toHaveLength(1);
    expect(maGiamGiaService.taoVoucherTuDoiDiem).toHaveBeenCalledWith(
      expect.objectContaining({
        maKH: 'KH006',
        soDiemDaDoi: 100,
        soTienGiam: 10000,
        maYeuCau: 'req-001',
      }),
      ketNoi,
    );
  });
});
