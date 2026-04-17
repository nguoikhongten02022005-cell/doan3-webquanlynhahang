import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatBanService } from './dat-ban.service';

@ApiTags('dat-ban')
@Controller('api/dat-ban')
export class DatBanController {
  constructor(private readonly datBanService: DatBanService) {}

  @Get()
  layDanhSachDatBan(@Headers('authorization') authorization?: string) {
    return this.datBanService.layDanhSachDatBan(authorization);
  }

  @Get('khach/:maKh')
  layLichSuDatBan(@Headers('authorization') authorization: string | undefined, @Param('maKh') maKh: string) {
    return this.datBanService.layLichSuDatBan(authorization, maKh);
  }

  @Post()
  taoDatBan(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.datBanService.taoDatBan(authorization, body);
  }

  @Get('availability')
  layKhaDungDatBan(@Query() query: Record<string, unknown>) {
    return this.datBanService.layKhaDungDatBan(query);
  }

  @Patch(':maDatBan')
  capNhatDatBan(@Headers('authorization') authorization: string | undefined, @Param('maDatBan') maDatBan: string, @Body() body: Record<string, unknown>) {
    return this.datBanService.capNhatDatBan(authorization, maDatBan, body);
  }

  @Patch(':maDatBan/status')
  capNhatTrangThaiDatBan(@Headers('authorization') authorization: string | undefined, @Param('maDatBan') maDatBan: string, @Body() body: Record<string, unknown>) {
    return this.datBanService.capNhatTrangThaiDatBan(authorization, maDatBan, String(body.trangThai || ''));
  }

  @Patch(':maDatBan/assign-tables')
  ganBanChoDatBan(@Headers('authorization') authorization: string | undefined, @Param('maDatBan') maDatBan: string, @Body() body: Record<string, unknown>) {
    return this.datBanService.ganBanChoDatBan(authorization, maDatBan, body);
  }
}
