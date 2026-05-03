import { Module } from '@nestjs/common';
import { MaGiamGiaController } from './ma-giam-gia.controller';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [MaGiamGiaController],
  providers: [MaGiamGiaService],
  exports: [MaGiamGiaService],
})
export class MaGiamGiaModule {}
