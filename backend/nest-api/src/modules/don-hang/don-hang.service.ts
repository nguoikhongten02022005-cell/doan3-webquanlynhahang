import { Injectable } from '@nestjs/common';
import { DonHangQueryService } from './don-hang-query.service';
import { DonHangCreateOrderService } from './don-hang-create-order.service';
import { DonHangPaymentStatusService } from './don-hang-payment-status.service';
import { BanGhi } from '../../common/types';

@Injectable()
export class DonHangService {
  constructor(
    private readonly donHangQueryService: DonHangQueryService,
    private readonly donHangCreateOrderService: DonHangCreateOrderService,
    private readonly donHangPaymentStatusService: DonHangPaymentStatusService,
  ) {}

  async layChiTietDonHangTheoMaPublic(maDonHang: string) {
    return this.donHangQueryService.layChiTietDonHangTheoMa(maDonHang);
  }

  layDanhSachDonHang() {
    return this.donHangQueryService.layDanhSachDonHang();
  }

  layDonHangCuaToi(nguoiDung: any) {
    return this.donHangQueryService.layDonHangCuaToi(nguoiDung);
  }

  layDonHangCoTheDanhGia(nguoiDung: any) {
    return this.donHangQueryService.layDonHangCoTheDanhGia(nguoiDung);
  }

  layChiTietDonHang(nguoiDung: any, maDonHang: string) {
    return this.donHangQueryService.layChiTietDonHang(nguoiDung, maDonHang);
  }

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

  capNhatTrangThaiDonHang(maDonHang: string, trangThai: string) {
    return this.donHangPaymentStatusService.capNhatTrangThaiDonHang(maDonHang, trangThai);
  }
}
