import { Injectable, NotFoundException } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { DonHangCreateOrderService } from '../don-hang/don-hang-create-order.service';
import { DonHangPaymentStatusService } from '../don-hang/don-hang-payment-status.service';
import { BanGhi } from '../../common/types';

@Injectable()
export class TaiBanService {
  constructor(
    private readonly mysql: MySqlService,
    private readonly donHangCreateOrderService: DonHangCreateOrderService,
    private readonly donHangPaymentStatusService: DonHangPaymentStatusService,
  ) {}

  private async timMaBan(giaTri: string): Promise<string | null> {
    if (!giaTri) return null;
    const [banTheoMa] = await this.mysql.truyVan(
      'SELECT MaBan FROM Ban WHERE MaBan = ? LIMIT 1',
      [giaTri],
    );
    if (banTheoMa) return banTheoMa.MaBan;
    const so = Number(giaTri);
    if (Number.isFinite(so) && so > 0) {
      const [banTheoSo] = await this.mysql.truyVan(
        'SELECT MaBan FROM Ban WHERE SoBan = ? LIMIT 1',
        [so],
      );
      if (banTheoSo) return banTheoSo.MaBan;
    }
    return null;
  }

  async taoOrderTaiBan(maBan: string, payload: BanGhi) {
    const ma = await this.timMaBan(maBan);
    if (!ma) throw new NotFoundException('Khong tim thay ban.');
    return this.donHangCreateOrderService.taoOrderTaiBan(ma, payload);
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
}
