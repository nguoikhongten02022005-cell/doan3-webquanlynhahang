import { Injectable } from '@nestjs/common';
import { DonHangTableOrderService } from '../don-hang/don-hang-table-order.service';
import { DonHangPaymentStatusService } from '../don-hang/don-hang-payment-status.service';

type BanGhi = Record<string, any>;

@Injectable()
export class TaiBanService {
  constructor(
    private readonly donHangTableOrderService: DonHangTableOrderService,
    private readonly donHangPaymentStatusService: DonHangPaymentStatusService,
  ) {}

  taoOrderTaiBan(maBan: string, payload: BanGhi) {
    return this.donHangTableOrderService.taoOrderTaiBan(maBan, payload);
  }

  layOrderDangMoTaiBan(maBan: string) {
    return this.donHangTableOrderService.layOrderDangMoTaiBan(maBan);
  }

  yeuCauThanhToanTaiBan(maBan: string) {
    return this.donHangPaymentStatusService.yeuCauThanhToanTaiBan(maBan);
  }

  xacNhanThanhToanTaiBan(maBan: string) {
    return this.donHangPaymentStatusService.xacNhanThanhToanTaiBan(maBan);
  }
}
