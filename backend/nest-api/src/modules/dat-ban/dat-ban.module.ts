import { Module } from '@nestjs/common';
import { DatBanController } from './dat-ban.controller';
import { DatBanService } from './dat-ban.service';
import { DatBanQueryService } from './dat-ban-query.service';
import { DatBanCommandService } from './dat-ban-command.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';
import { DonHangModule } from '../don-hang/don-hang.module';

@Module({
  imports: [CoreModule, AuthModule, DonHangModule],
  controllers: [DatBanController],
  providers: [DatBanService, DatBanQueryService, DatBanCommandService],
})
export class DatBanModule {}
