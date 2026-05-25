import { Module } from '@nestjs/common';
import { BanController } from './ban.controller';
import { BanService } from './ban.service';
import { BanCrudService } from './ban-crud.service';
import { BanTrangThaiQrService } from './ban-trang-thai-qr.service';
import { CoreModule } from '../core/core.module';
import { ThucDonModule } from '../thuc-don/thuc-don.module';
import { TaiBanModule } from '../tai-ban/tai-ban.module';

@Module({
  imports: [CoreModule, ThucDonModule, TaiBanModule],
  controllers: [BanController],
  providers: [BanService, BanCrudService, BanTrangThaiQrService],
})
export class BanModule {}
