import { Module } from '@nestjs/common';
import { MySqlService } from '../../database/mysql/mysql.service';
import { BootstrapService } from '../../config/bootstrap.service';

@Module({
  providers: [MySqlService, BootstrapService],
  exports: [MySqlService, BootstrapService],
})
export class CoreModule {}
