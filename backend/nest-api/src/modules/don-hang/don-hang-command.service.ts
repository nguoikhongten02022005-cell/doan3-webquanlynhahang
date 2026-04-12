import { Injectable } from '@nestjs/common';
import { DonHangCreateOrderService } from './don-hang-create-order.service';
import { DonHangPaymentStatusService } from './don-hang-payment-status.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DonHangCommandService {
  constructor(
    private readonly donHangCreateOrderService: DonHangCreateOrderService,
    private readonly donHangPaymentStatusService: DonHangPaymentStatusService,
  ) {}

  taoDonHang(payload: BanGhi, loaiDon?: string) {
    return this.donHangCreateOrderService.taoDonHang(payload, loaiDon);
  }

  taoOrderTaiBan(maBan: string, payload: BanGhi) {
    return this.donHangCreateOrderService.taoOrderTaiBan(maBan, payload);
  }

  layOrderDangMoTaiBan(maBan: string) {
    return this.donHangPaymentStatusService.layOrderDangMoTaiBan(maBan);
  }

  yeuCauThanhToanTaiBan(maBan: string) {
    return this.donHangPaymentStatusService.yeuCauThanhToanTaiBan(maBan);
  }

  xacNhanThanhToanTaiBan(maBan: string) {
    return this.donHangPaymentStatusService.xacNhanThanhToanTaiBan(maBan);
  }

  capNhatTrangThaiDonHang(dauTrang: string | undefined, maDonHang: string, trangThai: string) {
    return this.donHangPaymentStatusService.capNhatTrangThaiDonHang(dauTrang, maDonHang, trangThai);
  }
}
