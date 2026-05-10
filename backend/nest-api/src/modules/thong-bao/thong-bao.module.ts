import { Module } from '@nestjs/common';
import { ThongBaoController } from './thong-bao.controller';
import { ThongBaoService } from './thong-bao.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ThongBaoController],
  providers: [ThongBaoService],
  exports: [ThongBaoService],
})
export class ThongBaoModule {}