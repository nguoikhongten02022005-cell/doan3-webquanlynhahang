import { Module } from '@nestjs/common';
import { TaiBanService } from './tai-ban.service';
import { DonHangModule } from '../don-hang/don-hang.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule, DonHangModule],
  providers: [TaiBanService],
  exports: [TaiBanService],
})
export class TaiBanModule {}
