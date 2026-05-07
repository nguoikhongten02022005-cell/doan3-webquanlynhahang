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
import { DonHangService } from './don-hang.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BanGhi } from '../../common/types';

@ApiTags('don-hang')
@Controller('api/don-hang')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  @Roles('Admin', 'NhanVien')
  @Get()
  layDanhSachDonHang() {
    return this.donHangService.layDanhSachDonHang();
  }

  @Get('me')
  layDonHangCuaToi(@CurrentUser() nguoiDung: any) {
    return this.donHangService.layDonHangCuaToi(nguoiDung);
  }

  @Get('co-the-danh-gia')
  layDonHangCoTheDanhGia(@CurrentUser() nguoiDung: any) {
    return this.donHangService.layDonHangCoTheDanhGia(nguoiDung);
  }

  @Get(':maDonHang')
  layChiTietDonHang(
    @CurrentUser() nguoiDung: any,
    @Param('maDonHang') maDonHang: string,
  ) {
    return this.donHangService.layChiTietDonHang(nguoiDung, maDonHang);
  }

  @Public()
  @Post()
  taoDonHang(@Body() body: BanGhi) {
    return this.donHangService.taoDonHang(body);
  }

  @Roles('Admin', 'NhanVien')
  @Patch(':maDonHang/status')
  capNhatTrangThaiDonHang(
    @Param('maDonHang') maDonHang: string,
    @Body() body: BanGhi,
  ) {
    return this.donHangService.capNhatTrangThaiDonHang(maDonHang, String(body.trangThai || ''));
  }
}
