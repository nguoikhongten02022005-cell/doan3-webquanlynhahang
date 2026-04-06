import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { BootstrapService } from './bootstrap.service';
import { MySqlService } from './mysql.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ApiController],
  providers: [ApiService, MySqlService, BootstrapService],
})
export class AppModule {}
