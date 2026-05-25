import { Module } from '@nestjs/common';
import { DiemTichLuyController } from './diem-tich-luy.controller';
import { DiemTichLuyService } from './diem-tich-luy.service';
import { CoreModule } from '../core/core.module';
import { MaGiamGiaModule } from '../ma-giam-gia/ma-giam-gia.module';

@Module({
  imports: [CoreModule, MaGiamGiaModule],
  controllers: [DiemTichLuyController],
  providers: [DiemTichLuyService],
  exports: [DiemTichLuyService],
})
export class DiemTichLuyModule {}
