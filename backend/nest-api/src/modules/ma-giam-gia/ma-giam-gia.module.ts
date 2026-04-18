import { Module } from '@nestjs/common';
import { MaGiamGiaController } from './ma-giam-gia.controller';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [MaGiamGiaController],
  providers: [MaGiamGiaService],
})
export class MaGiamGiaModule {}
