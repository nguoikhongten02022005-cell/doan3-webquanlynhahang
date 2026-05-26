import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { DiemTichLuyModule } from '../diem-tich-luy/diem-tich-luy.module';
import { KhachHangController } from './khach-hang.controller';
import { KhachHangService } from './khach-hang.service';

@Module({
  imports: [CoreModule, DiemTichLuyModule],
  controllers: [KhachHangController],
  providers: [KhachHangService],
  exports: [KhachHangService],
})
export class KhachHangModule {}
