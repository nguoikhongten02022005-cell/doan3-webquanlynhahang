import { Module } from '@nestjs/common';
import { ThucDonController } from './thuc-don.controller';
import { ThucDonService } from './thuc-don.service';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [ThucDonController],
  providers: [ThucDonService],
  exports: [ThucDonService],
})
export class ThucDonModule {}
