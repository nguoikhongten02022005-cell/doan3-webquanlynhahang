import { DonHangCreateOrderService } from './don-hang-create-order.service';

describe('DonHangCreateOrderService', () => {
  it('khong tang luot dung voucher khi chi append mon vao don dang mo', async () => {
    const execute = jest.fn(async () => undefined);
    const query = jest
      .fn()
      .mockResolvedValueOnce([[{ MaDonHang: 'DH_EXIST' }]])
      .mockResolvedValueOnce([[{ TongTien: 180000 }]]);

    const mysql = {
      giaoDich: jest.fn(async (callback) => callback({ execute, query })),
    };

    const donHangPricingService = {
      tinhLaiGiaDonHang: jest.fn().mockResolvedValue({
        chiTietDaTinh: [
          {
            maChiTiet: 'CT_1',
            maMon: 'M01',
            soLuong: 1,
            donGia: 50000,
            thanhTien: 50000,
            tenMon: 'Mon 1',
            ghiChu: '',
          },
        ],
        tongHopGia: {
          tamTinh: 50000,
          phiDichVu: 0,
          giamGia: 0,
          tongTien: 50000,
        },
        maGiamGia: { hopLe: true, maGiamGia: 'LOYAL25K' },
        diemApDung: { soDiem: 0, soTienGiam: 0 },
      }),
    };

    const diemTichLuyService = {
      doiDiem: jest.fn(),
    };

    const service = new DonHangCreateOrderService(
      mysql as any,
      donHangPricingService as any,
      diemTichLuyService as any,
    );

    await service.taoDonHang({
      maBan: 'B001',
      maDatBan: 'DB001',
      nguonTao: 'DatBan',
      maKH: 'KH006',
      chiTiet: [{ maMon: 'M01', soLuong: 1 }],
    });

    expect(execute).not.toHaveBeenCalledWith(
      expect.stringContaining(
        'UPDATE MaGiamGia SET SoLanDaDung = SoLanDaDung + 1 WHERE MaCode = ?',
      ),
      expect.anything(),
      expect.anything(),
    );
  });
});
