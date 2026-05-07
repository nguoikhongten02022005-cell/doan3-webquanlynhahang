import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BanService } from './ban.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { BanGhi } from '../../common/types';

@ApiTags('ban')
@Controller('api/ban')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BanController {
  constructor(private readonly banService: BanService) {}

  @Public()
  @Get()
  layDanhSachBan() {
    return this.banService.layDanhSachBan();
  }

  @Roles('Admin')
  @Post()
  taoBan(@Body() body: BanGhi) {
    return this.banService.taoBan(body);
  }

  @Roles('Admin')
  @Put(':maBan')
  capNhatBan(@Param('maBan') maBan: string, @Body() body: BanGhi) {
    return this.banService.capNhatBan(maBan, body);
  }

  @Roles('Admin')
  @Delete(':maBan')
  xoaBan(@Param('maBan') maBan: string) {
    return this.banService.xoaBan(maBan);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maBan/status')
  capNhatTrangThaiBan(
    @Param('maBan') maBan: string,
    @Body() body: BanGhi,
  ) {
    return this.banService.capNhatTrangThaiBan(maBan, String(body.trangThai || ''));
  }

  @Roles('Admin', 'NhanVien')
  @Get(':maBan/qr')
  layQrBan(@Param('maBan') maBan: string) {
    return this.banService.layQrBan(maBan);
  }

  @Public()
  @Get(':maBan/thuc-don')
  layThucDonTheoBan(@Param('maBan') maBan: string) {
    return this.banService.layThucDonTheoBan(maBan);
  }

  @Public()
  @Post(':maBan/order')
  taoOrderTaiBan(@Param('maBan') maBan: string, @Body() body: BanGhi) {
    return this.banService.taoOrderTaiBan(maBan, body);
  }

  @Public()
  @Get(':maBan/order')
  layOrderDangMoTaiBan(@Param('maBan') maBan: string) {
    return this.banService.layOrderDangMoTaiBan(maBan);
  }

  @Public()
  @Post(':maBan/yeu-cau-thanh-toan')
  yeuCauThanhToanTaiBan(@Param('maBan') maBan: string) {
    return this.banService.yeuCauThanhToanTaiBan(maBan);
  }

  @Roles('Admin', 'NhanVien')
  @Post(':maBan/xac-nhan-thanh-toan')
  xacNhanThanhToanTaiBan(@Param('maBan') maBan: string) {
    return this.banService.xacNhanThanhToanTaiBan(maBan);
  }
}
