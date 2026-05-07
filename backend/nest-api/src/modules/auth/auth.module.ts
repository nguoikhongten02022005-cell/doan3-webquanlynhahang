import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoreModule } from '../core/core.module';
import { NguoiDungController } from './nguoi-dung.controller';

@Module({
  imports: [CoreModule],
  controllers: [AuthController, NguoiDungController],
  providers: [AuthService],
  exports: [AuthService, CoreModule],
})
export class AuthModule {}
