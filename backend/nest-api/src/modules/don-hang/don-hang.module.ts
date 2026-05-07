import { Module } from '@nestjs/common';
import { DonHangController } from './don-hang.controller';
import { DonHangService } from './don-hang.service';
import { DonHangPricingService } from './don-hang-pricing.service';
import { DonHangQueryService } from './don-hang-query.service';
import { DonHangCreateOrderService } from './don-hang-create-order.service';
import { DonHangPaymentStatusService } from './don-hang-payment-status.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';
import { DiemTichLuyModule } from '../diem-tich-luy/diem-tich-luy.module';

@Module({
  imports: [CoreModule, AuthModule, DiemTichLuyModule],
  controllers: [DonHangController],
  providers: [
    DonHangService,
    DonHangPricingService,
    DonHangQueryService,
    DonHangCreateOrderService,
    DonHangPaymentStatusService,
  ],
  exports: [
    DonHangService,
    DonHangPricingService,
    DonHangQueryService,
    DonHangCreateOrderService,
    DonHangPaymentStatusService,
  ],
})
export class DonHangModule {}
