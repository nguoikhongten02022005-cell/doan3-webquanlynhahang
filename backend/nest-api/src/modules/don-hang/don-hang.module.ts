import { Module } from '@nestjs/common';
import { DonHangController } from './don-hang.controller';
import { DonHangService } from './don-hang.service';
import { DonHangPricingService } from './don-hang-pricing.service';
import { DonHangQueryService } from './don-hang-query.service';
import { DonHangCommandService } from './don-hang-command.service';
import { DonHangCreateOrderService } from './don-hang-create-order.service';
import { DonHangPaymentStatusService } from './don-hang-payment-status.service';
import { DonHangTableOrderService } from './don-hang-table-order.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [DonHangController],
  providers: [
    DonHangService,
    DonHangPricingService,
    DonHangQueryService,
    DonHangCommandService,
    DonHangCreateOrderService,
    DonHangPaymentStatusService,
    DonHangTableOrderService,
  ],
  exports: [
    DonHangService,
    DonHangPricingService,
    DonHangQueryService,
    DonHangCommandService,
    DonHangCreateOrderService,
    DonHangPaymentStatusService,
    DonHangTableOrderService,
  ],
})
export class DonHangModule {}
