import { Module } from '@nestjs/common';
import { TaiBanService } from './tai-ban.service';
import { DonHangModule } from '../don-hang/don-hang.module';

@Module({
  imports: [DonHangModule],
  providers: [TaiBanService],
  exports: [TaiBanService],
})
export class TaiBanModule {}
