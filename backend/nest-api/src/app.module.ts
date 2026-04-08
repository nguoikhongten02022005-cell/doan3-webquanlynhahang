import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { BootstrapService } from './bootstrap.service';
import { MySqlService } from './mysql.service';

const moiTruong = process.env.NODE_ENV?.trim() || 'development';
const tapTinMoiTruong = `.env.${moiTruong}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [tapTinMoiTruong, '.env'],
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService, MySqlService, BootstrapService],
})
export class AppModule {}
