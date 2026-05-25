import { DonHangPaymentStatusService } from './don-hang-payment-status.service';

describe('DonHangPaymentStatusService', () => {
  it('returns the updated order status after changing status', async () => {
    const state = { trangThai: 'Preparing', trangThaiBan: 'Occupied' };
    const connection = {
      execute: jest.fn(async (query: string, params: any[]) => {
        if (query.includes('UPDATE DonHang')) state.trangThai = params[0];
        if (query.includes('UPDATE Ban')) state.trangThaiBan = params[0];
      }),
      query: jest.fn().mockResolvedValue([[]]),
    };
    const mysql = {
      truyVan: jest
        .fn()
        .mockResolvedValue([
          { MaDonHang: 'DH_TEST', MaBan: 'B003', TrangThai: 'Preparing' },
        ]),
      giaoDich: jest.fn(async (callback) => callback(connection)),
    };
    const donHangQueryService = {
      layChiTietDonHangKhongKiemTraQuyen: jest.fn(
        async (_maDonHang, ketNoi) => ({
          success: true,
          data: {
            donHang: { trangThai: ketNoi ? state.trangThai : 'Preparing' },
          },
          message: 'ok',
          meta: null,
        }),
      ),
    };
    const service = new DonHangPaymentStatusService(
      mysql as any,
      donHangQueryService as any,
      { tinhDiemTuDonHang: jest.fn() } as any,
    );

    const ketQua = await service.capNhatTrangThaiDonHang(
      'DH_TEST',
      'Completed',
    );

    expect((ketQua.data as any).donHang.trangThai).toBe('Completed');
    expect(
      donHangQueryService.layChiTietDonHangKhongKiemTraQuyen,
    ).toHaveBeenCalledWith('DH_TEST', connection);
  });
});
