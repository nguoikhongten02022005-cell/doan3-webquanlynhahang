import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatBanService } from './dat-ban.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BanGhi } from '../../common/types';

@ApiTags('dat-ban')
@Controller('api/dat-ban')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DatBanController {
  constructor(private readonly datBanService: DatBanService) {}

  @Roles('Admin', 'NhanVien')
  @Get()
  layDanhSachDatBan() {
    return this.datBanService.layDanhSachDatBan();
  }

  @Get('khach/:maKh')
  layLichSuDatBan(
    @CurrentUser() nguoiDung: any,
    @Param('maKh') maKh: string,
  ) {
    return this.datBanService.layLichSuDatBan(nguoiDung, maKh);
  }

  @Post()
  taoDatBan(@CurrentUser() nguoiDung: any, @Body() body: BanGhi) {
    return this.datBanService.taoDatBan(nguoiDung, body);
  }

  @Public()
  @Get('availability')
  layKhaDungDatBan(@Query() query: Record<string, unknown>) {
    return this.datBanService.layKhaDungDatBan(query);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDatBan')
  capNhatDatBan(
    @Param('maDatBan') maDatBan: string,
    @Body() body: BanGhi,
  ) {
    return this.datBanService.capNhatDatBan(maDatBan, body);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDatBan/status')
  capNhatTrangThaiDatBan(
    @Param('maDatBan') maDatBan: string,
    @Body() body: BanGhi,
  ) {
    return this.datBanService.capNhatTrangThaiDatBan(maDatBan, String(body.trangThai || ''));
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDatBan/assign-tables')
  ganBanChoDatBan(
    @Param('maDatBan') maDatBan: string,
    @Body() body: BanGhi,
  ) {
    return this.datBanService.ganBanChoDatBan(maDatBan, body);
  }
}
