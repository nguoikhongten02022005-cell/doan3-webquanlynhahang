import { Module } from '@nestjs/common';
import { ThongKeController } from './thong-ke.controller';
import { ThongKeService } from './thong-ke.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [ThongKeController],
  providers: [ThongKeService],
  exports: [ThongKeService],
})
export class ThongKeModule {}