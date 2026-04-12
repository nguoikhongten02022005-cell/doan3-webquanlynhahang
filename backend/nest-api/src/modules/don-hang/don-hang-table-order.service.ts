import { Injectable } from '@nestjs/common';
import { DonHangCommandService } from './don-hang-command.service';
import { DonHangQueryService } from './don-hang-query.service';

type BanGhi = Record<string, any>;

@Injectable()
export class DonHangTableOrderService {
  constructor(
    private readonly donHangCommandService: DonHangCommandService,
    private readonly donHangQueryService: DonHangQueryService,
  ) {}

  taoOrderTaiBan(maBan: string, payload: BanGhi) {
    return this.donHangCommandService.taoOrderTaiBan(maBan, payload);
  }

  layOrderDangMoTaiBan(maBan: string) {
    return this.donHangCommandService.layOrderDangMoTaiBan(maBan);
  }

  layChiTietDonHangTheoMa(maDonHang: string) {
    return this.donHangQueryService.layChiTietDonHangTheoMa(maDonHang);
  }
}
