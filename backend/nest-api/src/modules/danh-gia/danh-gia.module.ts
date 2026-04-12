import { Module } from '@nestjs/common';
import { DanhGiaController } from './danh-gia.controller';
import { DanhGiaService } from './danh-gia.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [DanhGiaController],
  providers: [DanhGiaService],
})
export class DanhGiaModule {}
