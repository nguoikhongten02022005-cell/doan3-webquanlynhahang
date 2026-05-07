import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DanhGiaService } from './danh-gia.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BanGhi } from '../../common/types';

@ApiTags('danh-gia')
@Controller('api/danh-gia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DanhGiaController {
  constructor(private readonly danhGiaService: DanhGiaService) {}

  @Public()
  @Get()
  layDanhSachDanhGiaCongKhai() {
    return this.danhGiaService.layDanhSachDanhGia(false);
  }

  @Roles('Admin', 'NhanVien')
  @Get('noi-bo')
  layDanhSachDanhGiaNoiBo() {
    return this.danhGiaService.layDanhSachDanhGia(true);
  }

  @Post()
  taoDanhGia(@CurrentUser() nguoiDung: any, @Body() body: BanGhi) {
    return this.danhGiaService.taoDanhGia(nguoiDung, body);
  }

  @Roles('Admin')
  @Patch(':maDanhGia/duyet')
  duyetDanhGia(
    @Param('maDanhGia') maDanhGia: string,
    @Body() body: BanGhi,
  ) {
    return this.danhGiaService.duyetDanhGia(maDanhGia, body);
  }
}
