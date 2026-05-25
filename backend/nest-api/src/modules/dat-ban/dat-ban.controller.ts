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
import { TaoDatBanDto } from './dto/tao-dat-ban.dto';
import { CapNhatDatBanDto } from './dto/cap-nhat-dat-ban.dto';
import { CapNhatTrangThaiDatBanDto } from './dto/cap-nhat-trang-thai-dat-ban.dto';
import { GanBanChoDatBanDto } from './dto/gan-ban-cho-dat-ban.dto';
import { LayKhaDungDatBanQueryDto } from './dto/lay-kha-dung-dat-ban.query';

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
  layLichSuDatBan(@CurrentUser() nguoiDung: any, @Param('maKh') maKh: string) {
    return this.datBanService.layLichSuDatBan(nguoiDung, maKh);
  }

  @Post()
  taoDatBan(@CurrentUser() nguoiDung: any, @Body() body: TaoDatBanDto) {
    return this.datBanService.taoDatBan(nguoiDung, body);
  }

  @Public()
  @Get('availability')
  layKhaDungDatBan(@Query() query: LayKhaDungDatBanQueryDto) {
    return this.datBanService.layKhaDungDatBan(query);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDatBan')
  capNhatDatBan(
    @Param('maDatBan') maDatBan: string,
    @Body() body: CapNhatDatBanDto,
  ) {
    return this.datBanService.capNhatDatBan(maDatBan, body);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDatBan/status')
  capNhatTrangThaiDatBan(
    @Param('maDatBan') maDatBan: string,
    @Body() body: CapNhatTrangThaiDatBanDto,
  ) {
    return this.datBanService.capNhatTrangThaiDatBan(
      maDatBan,
      String(body.trangThai || ''),
    );
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDatBan/assign-tables')
  ganBanChoDatBan(
    @Param('maDatBan') maDatBan: string,
    @Body() body: GanBanChoDatBanDto,
  ) {
    return this.datBanService.ganBanChoDatBan(maDatBan, body);
  }
}
