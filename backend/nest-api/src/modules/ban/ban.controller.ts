import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BanService } from './ban.service';

@ApiTags('ban')
@Controller('api/ban')
export class BanController {
  constructor(private readonly banService: BanService) {}

  @Get()
  layDanhSachBan() {
    return this.banService.layDanhSachBan();
  }

  @Post()
  taoBan(@Headers('authorization') authorization: string | undefined, @Body() body: Record<string, unknown>) {
    return this.banService.taoBan(authorization, body);
  }

  @Put(':maBan')
  capNhatBan(@Headers('authorization') authorization: string | undefined, @Param('maBan') maBan: string, @Body() body: Record<string, unknown>) {
    return this.banService.capNhatBan(authorization, maBan, body);
  }

  @Delete(':maBan')
  xoaBan(@Headers('authorization') authorization: string | undefined, @Param('maBan') maBan: string) {
    return this.banService.xoaBan(authorization, maBan);
  }

  @Patch(':maBan/status')
  capNhatTrangThaiBan(@Headers('authorization') authorization: string | undefined, @Param('maBan') maBan: string, @Body() body: Record<string, unknown>) {
    return this.banService.capNhatTrangThaiBan(authorization, maBan, String(body.trangThai || ''));
  }

  @Get(':maBan/qr')
  layQrBan(@Headers('authorization') authorization: string | undefined, @Param('maBan') maBan: string) {
    return this.banService.layQrBan(authorization, maBan);
  }

  @Get(':maBan/thuc-don')
  layThucDonTheoBan(@Param('maBan') maBan: string) {
    return this.banService.layThucDonTheoBan(maBan);
  }

  @Post(':maBan/order')
  taoOrderTaiBan(@Param('maBan') maBan: string, @Body() body: Record<string, unknown>) {
    return this.banService.taoOrderTaiBan(maBan, body);
  }

  @Get(':maBan/order')
  layOrderDangMoTaiBan(@Param('maBan') maBan: string) {
    return this.banService.layOrderDangMoTaiBan(maBan);
  }

  @Post(':maBan/yeu-cau-thanh-toan')
  yeuCauThanhToanTaiBan(@Param('maBan') maBan: string) {
    return this.banService.yeuCauThanhToanTaiBan(maBan);
  }

  @Post(':maBan/xac-nhan-thanh-toan')
  xacNhanThanhToanTaiBan(@Param('maBan') maBan: string) {
    return this.banService.xacNhanThanhToanTaiBan(maBan);
  }
}
