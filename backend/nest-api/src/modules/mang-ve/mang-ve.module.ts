import { Module } from '@nestjs/common';
import { MangVeController } from './mang-ve.controller';
import { MangVeService } from './mang-ve.service';
import { DonHangModule } from '../don-hang/don-hang.module';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule, DonHangModule],
  controllers: [MangVeController],
  providers: [MangVeService],
})
export class MangVeModule {}
