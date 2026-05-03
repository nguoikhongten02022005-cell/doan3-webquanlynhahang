import { Module } from '@nestjs/common';
import { DiemTichLuyController } from './diem-tich-luy.controller';
import { DiemTichLuyService } from './diem-tich-luy.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [DiemTichLuyController],
  providers: [DiemTichLuyService],
  exports: [DiemTichLuyService],
})
export class DiemTichLuyModule {}
