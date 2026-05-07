import { Module } from '@nestjs/common';
import { DiemTichLuyController } from './diem-tich-luy.controller';
import { DiemTichLuyService } from './diem-tich-luy.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [DiemTichLuyController],
  providers: [DiemTichLuyService],
  exports: [DiemTichLuyService],
})
export class DiemTichLuyModule {}
